import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { inject, injectable } from 'inversify';
import { promisify } from 'util';

import { InterfaceErrorHandlerPlugin } from '../../plugins/error-handler.interface';
import { InputInterface, OutputInterface } from '../models/types';
import { logger } from '../utils/logger';
import {getTransResponse} from './getResponse';

// Convert fs.readFile into Promise version of same
const readFile = promisify(fs.readFile);
// const appendFile = promisify(fs.appendFile);

@injectable()
export class LoadFundsController {
  private _error: InterfaceErrorHandlerPlugin;

  constructor(
    @inject(nameof<InterfaceErrorHandlerPlugin>())
    errorFactory: (name: string) => InterfaceErrorHandlerPlugin
  ) {
    this._error = errorFactory(nameof<LoadFundsController>());
  }
  public async getFunds(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('Reading input file');
      const data = await readFile('input.txt', 'utf-8');

      // Split the text and convert to json
      // Filter the failed one as they are null
      const splitedData: InputInterface[] = data
        .split('\n')
        .map((f) => {
          try {
            return JSON.parse(f);
          } catch (error) {
            logger.warn('Error while parsing JSON');
          }
        })
        // .filter((f) => f !== null);

      res.json(this._getLoadFundsResult(splitedData));
      logger.info('Done reading file');
      next();
    } catch (error) {
      this._error.throwFormattedError({
        status: 400,
        message: 'Error while reading file',
        source: 'int',
        errorData: {
          error,
        },
      });
    }
  }

  private _getLoadFundsResult(data: InputInterface[]): OutputInterface[] {
    const result: OutputInterface[] = [];
    logger.info('Filtering data', { data });

    let response = getTransResponse(data);
    //@ts-ignore
    result.push(response)   
  
    logger.info('Successfully filtered data', { result });

    return result;
  }
}

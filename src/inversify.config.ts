import { Container, interfaces } from 'inversify';

import { InterfaceErrorHandlerPlugin } from './plugins/error-handler.interface';
import { ErrorHandlerPlugin } from './plugins/error-handler.plugin';
import { LoadFundsController } from './server/controllers/load-funds.controller';
import { SYMBOLS } from './server/models/error-symbol';

const appContainer = new Container();
appContainer
  .bind<InterfaceErrorHandlerPlugin>(nameof<InterfaceErrorHandlerPlugin>())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .toFactory<InterfaceErrorHandlerPlugin>((context: interfaces.Context) => {
    return (name: string): ErrorHandlerPlugin => {
      name = name || 'UNKNOWN';
      const service = appContainer.get<ErrorHandlerPlugin>(
        SYMBOLS.DiagnosticsInstance
      );
      service.setName(name);
      return service;
    };
  });
appContainer
  .bind<InterfaceErrorHandlerPlugin>(SYMBOLS.DiagnosticsInstance)
  .to(ErrorHandlerPlugin)
  .inTransientScope();
appContainer
  .bind<LoadFundsController>(nameof<LoadFundsController>())
  .to(LoadFundsController);
export { appContainer };

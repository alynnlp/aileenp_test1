import path = require('path');
import { createLogger, format, transports } from 'winston';

const { label, combine, timestamp, prettyPrint, metadata } = format;

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    label({ label: path.basename(process.mainModule?.filename || '') }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    prettyPrint(),
    metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.splat(),
        format.json(),
        format.prettyPrint()
      ),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: format.combine(
        // Render in one line in your log file.
        // If you use prettyPrint() here it will be really
        // difficult to exploit your logs files afterwards.
        format.splat(),
        format.json(),
        format.prettyPrint()
      ),
    }),
  ],
  exitOnError: false,
});

const loggerStream = {
  write: (message: string): void => {
    logger.info(message);
  },
};

export { logger, loggerStream };

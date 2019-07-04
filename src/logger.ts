import { transports, addColors, config as winstonConfig, createLogger, format } from 'winston';
import WinstonGraylog2 from 'winston-graylog2';
import config from './config';
import Transport from 'winston-transport';
import jsonStringify from 'fast-safe-stringify';
import { not, isEmpty } from 'ramda';

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // format.simple()
    format.printf(
      ({ timestamp, level, message, splat, ...rest }) =>
        `${timestamp} ${level}: ${message} ${not(isEmpty(Object.keys(rest))) ? jsonStringify(rest) : ''}`
    )
  ),
  levels: winstonConfig.syslog.levels,
  level: 'debug',
  transports: [
    new transports.Console({
      // colorize: true,
      // timestamp: true
    }),
    new WinstonGraylog2({
      handleExceptions: true,
      graylog: {
        servers: [{ host: config.graylogHost, port: config.graylogPort }]
      },
      staticMeta: { env: config.graylogEnv, service: 'hobbiton' }
    }) as Transport
  ]
});

// logger.setLevels({ fatal: 0, error: 1, warn: 2, info: 3, debug: 4, verbose: 5 });
// addColors({ fatal: 'red', error: 'red', warn: 'yellow', info: 'green', debug: 'blue', verbose: 'cyan' });

addColors(winstonConfig.syslog.colors);

// logger.rewriters.push((level, msg, meta) => {
//   meta.stringLevel = convertLevelToString(level);

//   return meta;
// });

// if (process.env.NODE_ENV !== 'production') {
//   winston.add(winston.transports.Console);
// }

export default logger;

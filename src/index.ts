import fs from 'fs';
import path from 'path';
import config from './config';
import logger from './logger';
import { listen } from './app';
// import initDb from './db/index';
// import initSql from './zkDb';

const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

logger.info(`Starting service v${packageJson.version} ...`);

process.on('uncaughtException', (err: Error) => {
  console.log(err);
  logger.error(`Unhandle exception: ${err.toString()}`, { error: err });
});

// process.on('unhandledRejection', (err: Error) => {
//   console.log(err);
//   logger.error(`Unhandle rejection: ${err.toString()}`, { error: err });
// });

(async function() {
  logger.info(`Configuration: ${JSON.stringify(config)}`, { config });

  await listen(config.serviceHost, config.servicePort);

  // initDb(config.mongoDbHost, config.mongoDbPort, config.mongoDbDatabase, config.mongoDbUser, config.mongoDbPassword);
})();

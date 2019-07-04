import fs from 'fs';
import os from 'os';
import { mergeDeepRight } from 'ramda';

interface Config {
  serviceHost: string;
  servicePort: number;

  // mongoDbHost: string;
  // mongoDbPort: number;
  // mongoDbDatabase: string;
  // mongoDbUser: string | null;
  // mongoDbPassword: string | null;

  // graylogHost: string;
  // graylogPort: number;
  // graylogEnv: string;

  installationFolder: string;
  downloadsFolder: string;
  gitlabToken: string;
  gitlabUrl: string;
}

const DEFAULT_CONFIG: Config = {
  serviceHost: '0.0.0.0',
  servicePort: 52937,

  // mongoDbHost: 'localhost',
  // mongoDbPort: 27017,
  // mongoDbDatabase: 'hobbiton',
  // mongoDbUser: null,
  // mongoDbPassword: null,

  // graylogHost: 'localhost',
  // graylogPort: 12201,
  // graylogEnv: '',

  installationFolder: 'c:\\apps\\hobbiton',
  downloadsFolder: os.tmpdir(),
  gitlabToken: '',
  gitlabUrl: ''
};

let config: Config = {
  serviceHost: defaultTo(DEFAULT_CONFIG.serviceHost, process.env.SERVICE_HOST),
  servicePort: defaultTo(
    DEFAULT_CONFIG.servicePort,
    process.env.SERVICE_PORT ? parseInt(process.env.SERVICE_PORT) : null
  ),

  // mongoDbHost: defaultTo(DEFAULT_CONFIG.mongoDbHost, process.env.HOBBITON_DB_HOST),
  // mongoDbPort: defaultTo(
  //   DEFAULT_CONFIG.mongoDbPort,
  //   process.env.HOBBITON_DB_PORT ? parseInt(process.env.HOBBITON_DB_PORT) : null
  // ),
  // mongoDbDatabase: defaultTo(DEFAULT_CONFIG.mongoDbDatabase, process.env.HOBBITON_DB_DATABASE),
  // mongoDbUser: defaultTo(DEFAULT_CONFIG.mongoDbUser, process.env.HOBBITON_DB_USER),
  // mongoDbPassword: defaultTo(DEFAULT_CONFIG.mongoDbPassword, process.env.HOBBITON_DB_PASSWORD),

  // graylogHost: defaultTo(DEFAULT_CONFIG.graylogHost, process.env.SIS_GRAYLOG_HOST),
  // graylogPort: defaultTo(
  //   DEFAULT_CONFIG.graylogPort,
  //   process.env.SIS_GRAYLOG_PORT ? parseInt(process.env.SIS_GRAYLOG_PORT) : null
  // ),
  // graylogEnv: defaultTo(DEFAULT_CONFIG.graylogEnv, process.env.SIS_GRAYLOG_ENV),

  installationFolder: defaultTo(DEFAULT_CONFIG.installationFolder, process.env.INSTALLATION_FOLDER),
  downloadsFolder: defaultTo(DEFAULT_CONFIG.downloadsFolder, process.env.DOWNLOADS_FOLDER),
  gitlabToken: defaultTo(DEFAULT_CONFIG.gitlabToken, process.env.GITLAB_TOKEN),
  gitlabUrl: defaultTo(DEFAULT_CONFIG.gitlabUrl, process.env.GITLAB_URL)
};

function defaultTo(...args: any[]) {
  let value;

  for (const arg of args) {
    value = arg || value;
  }

  return value;
}

export default Object.freeze(config);

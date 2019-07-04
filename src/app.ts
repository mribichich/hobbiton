import express from 'express';
import client from 'prom-client';
import logger from './logger';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { promisify } from 'util';
import axios from 'axios';
import unzip from 'unzipper';
import glob from 'glob';
import { isEmpty, sortBy, not } from 'ramda';
import { execFile } from 'child_process';
import config from './config';
import bodyParser from 'body-parser';
import { APPS } from './apps';
import { getAppVersion, isAppInstalled } from './utils';

const gitlabAxios = axios.create({
  baseURL: config.gitlabUrl,
  timeout: 15000,
  headers: { 'PRIVATE-TOKEN': config.gitlabToken }
});

const readFile = promisify(fs.readFile);

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/metrics', (req, res) => {
  res.send(client.register.metrics());
});

app.get('/api/apps', async (req, res) => {
  const apps = await Promise.all(
    sortBy(s => s.name, APPS).map(async m => {
      const installed = await isAppInstalled(m.installationDir);

      const base = { name: m.name, projectId: m.projectId, installed: true };

      if (not(installed)) {
        return { ...base, installed: false };
      }

      try {
        const version = await getAppVersion(m.installationDir);

        return { ...base, version };
      } catch (error) {
        return base;
      }
    })
  );

  res.json(apps);
});

app.get('/api/currentVersion/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const appInstalled = APPS.find(f => f.name === name);

    if (!appInstalled) {
      res.sendStatus(404);
      return;
    }

    const version = await getAppVersion(appInstalled.installationDir);

    res.json({ version });
  } catch (error) {
    logger.error(`Error getting VERSION file from: ${name}`, { error });

    res.sendStatus(500);
  }
});

app.post('/api/update/:projectId', async (req, res) => {
  const { projectId } = req.params;

  const pId = encodeURIComponent(projectId);

  const hash = new Date().getTime();

  const filepath = path.resolve(config.downloadsFolder, `hobbiton_${pId}_${hash}.zip`);
  const zipDirPath = path.resolve(config.downloadsFolder, `hobbiton_${pId}_${hash}`);
  const writer = fs.createWriteStream(filepath);

  logger.debug(`Downloading latest artifact for ${projectId}...`, { projectId });

  const response = await gitlabAxios.get(`projects/${pId}/jobs/artifacts/master/download`, {
    params: { job: 'build' },
    // responseType: 'arraybuffer'
    responseType: 'stream',
    timeout: undefined,
    onDownloadProgress: function(progressEvent) {
      console.log('download', progressEvent);
    }
  });

  response.data.pipe(writer);
  // // const outputFilename = '/tmp/file.mp3';
  // // fs.writeFileSync(outputFilename, result.data);

  writer.on('error', () => {
    logger.error(`Error downloading latest artifact for ${projectId}...`, { projectId });

    res.sendStatus(500);
  });
  writer.on('finish', () => {
    logger.debug(`Latest artifact saved: ${filepath}`, { filepath });

    fs.createReadStream(filepath)
      .pipe(unzip.Extract({ path: zipDirPath }))
      .on('error', () => res.sendStatus(500))
      .on('finish', (err: any) => {
        if (err) {
          logger.error(`Error unzipping file`);
          return res.sendStatus(500);
        }

        logger.debug(`Artifact file unzipped: ${zipDirPath}`, { zipDirPath });

        glob(`**/*.exe`, { cwd: zipDirPath }, function(error, files) {
          if (error) {
            logger.error(error);
            return res.status(400).json({ message: error });
          }

          if (isEmpty(files)) {
            logger.error(`Setup file not found`);
            return res.status(400).json({ message: 'No exe found' });
          }

          const [setupFile] = files;

          const setupFilePath = path.join(zipDirPath, setupFile);

          logger.debug(`Setup file found: ${setupFilePath}`, { setupFilePath });

          const child = execFile(setupFilePath, ['/S'], (error, stdout, stderr) => {
            if (error) {
              logger.error('error', { error, stderr });
              return res.status(400).json({ message: error });
            }

            logger.debug('stdout', stdout);

            // TODO: leer el archivo de log y enviarlo a la web
            // TODO: borrar los archivos temp

            res.json({ stdout });
          });
        });
      });
  });
});

export function listen(host: string, port: number) {
  return new Promise<void>((resolve, reject) => {
    app
      .listen(port, host, () => {
        logger.info(`Server listening on port ${port}`);

        resolve();
      })
      .on('error', err => reject(err));
  });
}

export default app;

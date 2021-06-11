import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import config from './config';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

export async function isAppInstalled(name: string) {
  const filePath = path.join(config.installationFolder, name);

  try {
    await readdir(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getAppVersion(name: string) {
  const filePath = path.join(config.installationFolder, name, 'VERSION');

  return await readFile(filePath, 'utf8');
}

export async function getAppConfig(name: string) {
  const filePath = path.join('/etc', name, '.env');

  return await readFile(filePath, 'utf8');
}

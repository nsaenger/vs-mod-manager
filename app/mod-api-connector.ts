import fetch from 'electron-fetch';
import { getFileProperties } from 'get-file-properties';
import { MOD_API } from '../src/app/shared/constants/mod-api';
import { Modinfo, ModRelease } from '../src/app/shared/interfaces/modinfo';

const fs = require('fs');
const path = require('path');
const StreamZip = require('node-stream-zip');

export function loadModsNamesFromDisk(): Promise<Modinfo[]> {
  return new Promise<Modinfo[]>((resolve, reject) => {
    const modLocation = path.join(process.env.APPDATA, 'VintagestoryData', 'Mods');
    const modFileNames = fs.readdirSync(modLocation);

    Promise.all(modFileNames.map(getModName))
      .then(resolve)
      .catch(reject);
  });
}

export function getGameVersion(location: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      let properties = fs.statSync(location);
      if (!properties.hasOwnProperty('Version'))
        properties = await getFileProperties(location);

      let version = 'v' + properties.Version;
      let vp = version.split('.');

      if (vp.length > 3)
        version = `${ vp[0] }.${ vp[1] }.${ vp[2] }`;

      resolve(version);
    } catch (e) {
      reject(e);
    }
  });
}

export function downloadMod(modRelease: ModRelease): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    fetch(MOD_API.FILE_BASE + modRelease.mainfile)
      .then(async response => {
        const modLocation = path.join(process.env.APPDATA, 'VintagestoryData', 'Mods');
        const buffer = await response.buffer();

        fs.writeFile(path.join(modLocation, modRelease.filename), buffer, () => resolve(true));
      }).catch(reject);
  });
}

export function removeMod(modName: string): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
      const modLocation = path.join(process.env.APPDATA, 'VintagestoryData', 'Mods', modName);
      fs.unlink(modLocation, (err) => {
        if (!err)
          resolve(true);

        reject(err);
      });
  });
}

function getModName(filename): Promise<Modinfo> {
  return new Promise<Modinfo>((resolve, reject) => {
    const zip = new StreamZip({
      file: path.join(process.env.APPDATA, 'VintagestoryData', 'Mods', filename),
      storeEntries: true,
    });

    zip.on('ready', () => {
      const modInfo = zip.entryDataSync('modinfo.json')
        .toString()
        .replace(/[^\u0000-\u007F]+/gi, '');

      const data: any = JSON.parse(modInfo);
      const keys = Object.keys(data);

      const idKey = keys.find(x => x.toLowerCase() === 'modid');
      const nameKey = keys.find(x => x.toLowerCase() === 'name');
      const versionKey = keys.find(x => x.toLowerCase() === 'version');
      const typeKey = keys.find(x => x.toLowerCase() === 'type');
      const descriptionKey = keys.find(x => x.toLowerCase() === 'description');

      resolve({
        modid: (idKey ? data[idKey] : data[nameKey]).replace(/[^a-zA-Z]/gi, ''),
        name: (nameKey ? data[nameKey] : data[idKey]),
        version: data[versionKey] ?? 'UNKNOWN',
        type: data[typeKey] ?? 'UNKNOWN',
        description: data[descriptionKey] ?? 'UNKNOWN',
      });
      zip.close();
    });

    zip.on('error', error => {
      reject(error);
      zip.close();
    });
  });
}

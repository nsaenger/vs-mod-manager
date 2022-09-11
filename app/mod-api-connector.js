"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMod = exports.downloadMod = exports.getGameVersion = exports.loadModsNamesFromDisk = void 0;
const electron_fetch_1 = require("electron-fetch");
const get_file_properties_1 = require("get-file-properties");
const mod_api_1 = require("../src/app/shared/constants/mod-api");
const fs = require('fs');
const path = require('path');
const StreamZip = require('node-stream-zip');
function loadModsNamesFromDisk() {
    return new Promise((resolve, reject) => {
        const modLocation = path.join(process.env.APPDATA, 'VintagestoryData', 'Mods');
        const modFileNames = fs.readdirSync(modLocation);
        Promise.all(modFileNames.map(getModName))
            .then(resolve)
            .catch(reject);
    });
}
exports.loadModsNamesFromDisk = loadModsNamesFromDisk;
function getGameVersion(location) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let properties = fs.statSync(location);
            if (!properties.hasOwnProperty('Version'))
                properties = yield (0, get_file_properties_1.getFileProperties)(location);
            let version = 'v' + properties.Version;
            let vp = version.split('.');
            if (vp.length > 3)
                version = `${vp[0]}.${vp[1]}.${vp[2]}`;
            resolve(version);
        }
        catch (e) {
            reject(e);
        }
    }));
}
exports.getGameVersion = getGameVersion;
function downloadMod(modRelease) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        (0, electron_fetch_1.default)(mod_api_1.MOD_API.FILE_BASE + modRelease.mainfile)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            const modLocation = path.join(process.env.APPDATA, 'VintagestoryData', 'Mods');
            const buffer = yield response.buffer();
            fs.writeFile(path.join(modLocation, modRelease.filename), buffer, () => resolve(true));
        })).catch(reject);
    }));
}
exports.downloadMod = downloadMod;
function removeMod(modName) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const modLocation = path.join(process.env.APPDATA, 'VintagestoryData', 'Mods', modName);
        fs.unlink(modLocation, (err) => {
            if (!err)
                resolve(true);
            reject(err);
        });
    }));
}
exports.removeMod = removeMod;
function getModName(filename) {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: path.join(process.env.APPDATA, 'VintagestoryData', 'Mods', filename),
            storeEntries: true,
        });
        zip.on('ready', () => {
            var _a, _b, _c;
            const modInfo = zip.entryDataSync('modinfo.json')
                .toString()
                .replace(/[^\u0000-\u007F]+/gi, '');
            const data = JSON.parse(modInfo);
            const keys = Object.keys(data);
            const idKey = keys.find(x => x.toLowerCase() === 'modid');
            const nameKey = keys.find(x => x.toLowerCase() === 'name');
            const versionKey = keys.find(x => x.toLowerCase() === 'version');
            const typeKey = keys.find(x => x.toLowerCase() === 'type');
            const descriptionKey = keys.find(x => x.toLowerCase() === 'description');
            resolve({
                modid: (idKey ? data[idKey] : data[nameKey]).replace(/[^a-zA-Z]/gi, ''),
                name: (nameKey ? data[nameKey] : data[idKey]),
                version: (_a = data[versionKey]) !== null && _a !== void 0 ? _a : 'UNKNOWN',
                type: (_b = data[typeKey]) !== null && _b !== void 0 ? _b : 'UNKNOWN',
                description: (_c = data[descriptionKey]) !== null && _c !== void 0 ? _c : 'UNKNOWN',
            });
            zip.close();
        });
        zip.on('error', error => {
            reject(error);
            zip.close();
        });
    });
}
//# sourceMappingURL=mod-api-connector.js.map
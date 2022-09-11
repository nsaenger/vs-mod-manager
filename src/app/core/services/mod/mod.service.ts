import { Injectable } from '@angular/core';
import { ElectronService } from '@core/services/electron/electron.service';
import { MOD_API } from '@shared/constants/mod-api';
import { GameVersion } from '@shared/interfaces/game-version';
import { Modinfo, ModRelease } from '@shared/interfaces/modinfo';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModService {

  public gameVersion: BehaviorSubject<GameVersion> = new BehaviorSubject(null);
  public installedMods: BehaviorSubject<Modinfo[]> = new BehaviorSubject([]);

  constructor(
    private electronService: ElectronService
  ) {
  }

  public getInstalledMods(): Promise<Modinfo[]> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer
        .on("loadedMods", (event, mods) => {
          this.installedMods.next(mods)
          resolve(mods);
        });
      this.electronService.ipcRenderer
        .on("loadedModsError", (event, args) => reject(args));

      this.electronService.ipcRenderer.send("loadModsFromDisk");
    })
  }

  public getGameVersion(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer
        .on("gameVersion", (event, version) => resolve(version));
      this.electronService.ipcRenderer
        .on("gameVersionError", (event, error) => reject(error));

      this.electronService.ipcRenderer.send("getGameVersion", filePath);
    })
  }

  public getAllMods(): Promise<Modinfo[]> {
    return this.electronService.fetch(MOD_API.BASE + MOD_API.MODS);
  }

  public loadMod(modid: string): Promise<any> {
    return this.electronService.fetch(MOD_API.BASE + MOD_API.MOD + modid);
  }

  public downloadMod(modRelease: ModRelease) {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer
        .on("modDownloaded", (event, args) => resolve(args));
      this.electronService.ipcRenderer
        .on("modDownloaded", (event, args) => reject(args));

      this.electronService.ipcRenderer.send("downloadMod", modRelease);
    })
  }

  public removeMod(modName: string) {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer
        .on("modRemoved", (event, args) => resolve(args));
      this.electronService.ipcRenderer
        .on("modRemoved", (event, args) => reject(args));

      this.electronService.ipcRenderer.send("removeMod", modName);
    })
  }
}

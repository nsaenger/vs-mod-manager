import { Component, Input, OnInit } from '@angular/core';
import { MOD_API } from '@app/shared/constants/mod-api';
import { ModService } from '@core/services/mod/mod.service';
import { GameVersion } from '@shared/interfaces/game-version';
import { DetailedModInfo, Modinfo, ModRelease } from '@shared/interfaces/modinfo';

@Component({
  selector: 'mod-viewer',
  templateUrl: './mod-viewer.component.html',
  styleUrls: [ './mod-viewer.component.scss' ],
})
export class ModViewerComponent implements OnInit {

  @Input() modInfo: Modinfo = null;
  public details: DetailedModInfo;
  public MOD_API = MOD_API;

  public installedRelease: ModRelease = null;
  public compatibleRelease: ModRelease = null;
  public displayedColumns: string[] = [ 'releaseid', 'modversion', 'downloads', 'created', 'tags', 'installed', 'download' ];

  constructor(
    private modService: ModService,
  ) {
    modService.gameVersion.subscribe((version: GameVersion) => {
      this.getCompatibleRelease();
    });
  }

  ngOnInit() {
    this.modService.loadMod(this.modInfo.modid).then(response => {
      this.details = response.mod;
      this.getCompatibleRelease();
      this.installedRelease = this.details.releases.find(x => x.modversion === this.modInfo.version);
    });
  }

  public isInstalledCompatible(version: string) {
    return this.modService.gameVersion.value?.name === version;
  }

  public isModCompatible() {
    let compatible = false;
    const version = this.modService.gameVersion.value?.name;

    if (!version)
      return false;

    this.details.releases.map(release => {
      if (release.tags.includes(version)) {
        compatible = true;
      }
    });
    return compatible;
  }

  public getCompatibleRelease() {
    const version = this.modService.gameVersion.value?.name;
    this.compatibleRelease = this.details?.releases?.find(release => release.tags.includes(version)) ?? null;
  }

  public isVersionCompatible(tag: string) {
    return this.modService.gameVersion.value?.name === tag;
  }

  public download(modRelease: ModRelease) {
    this.modService.downloadMod(modRelease).then(() => {
      this.modService.removeMod(this.installedRelease.filename).then(() => {
        this.modService.getInstalledMods().then();
      });
    });
  }

  public remove(modName: string) {
    this.modService.removeMod(modName).then(() => {
      this.modService.getInstalledMods().then();
    });
  }
}

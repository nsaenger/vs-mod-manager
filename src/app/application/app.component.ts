import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModService } from '@core/services/mod/mod.service';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from '@core/services/electron/electron.service';
import { MOD_API } from '@shared/constants/mod-api';
import { GameVersion } from '@shared/interfaces/game-version';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('fileInput') public fileInput: ElementRef;

  public gameVersions: GameVersion[] = [];
  public selectedGameVersion: GameVersion = null;

  constructor(
    public electronService: ElectronService,
    public modService: ModService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');

    modService.gameVersion.subscribe(version => {
      if (!!version && version.name != this.selectedGameVersion.name)
        this.selectedGameVersion = version;
    })
  }

  ngOnInit(): void {
    this.electronService.fetch(MOD_API.BASE + MOD_API.GAME_VERSIONS).then((response) => {
      this.gameVersions = response.gameversions;
    });
  }

  public openFileChooser() {
    this.fileInput.nativeElement.click();
  }

  public getFileVersion(event: Event) {
    const file =  this.fileInput.nativeElement.files[0];
    this.modService.getGameVersion(file.path).then(version => {
      this.selectedGameVersion = this.gameVersions.find(x => version.startsWith(x.name));
      this.modService.gameVersion.next(this.selectedGameVersion);
    });
  }
}

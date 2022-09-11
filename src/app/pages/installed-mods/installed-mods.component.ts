import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '@core/services/electron/electron.service';
import { Modinfo } from '@shared/interfaces/modinfo';
import { ModService } from '@core/services/mod/mod.service';

@Component({
  selector: 'installed-mods',
  templateUrl: './installed-mods.component.html',
  styleUrls: ['./installed-mods.component.scss']
})
export class InstalledModsComponent implements OnInit {

  public installedMods: Modinfo[] = [];

  constructor(
    private router: Router,
    private electron: ElectronService,
    private mods: ModService
  ) {
    this.mods.installedMods.subscribe(data => this.installedMods = data)
  }

  ngOnInit(): void {
    this.mods.getInstalledMods().then(data => this.installedMods = data);
  }
}

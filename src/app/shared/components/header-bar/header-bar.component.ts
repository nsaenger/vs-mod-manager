import { Component } from '@angular/core';
import { ElectronService } from '@core/services/electron/electron.service';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent {

  constructor(
    public electronService: ElectronService,
  ) {
  }

  public close() {
    this.electronService.closeApp();
  }
}

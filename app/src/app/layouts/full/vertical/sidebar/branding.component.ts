import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="branding p-b-0 d-flex justify-content-end" >
      <a href="/" *ngIf="options.theme === 'light'">
        <img style="width: 200px; padding: 0;"
          src="./assets/images/logos/AP-removebg-preview.png"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
      <a href="/" *ngIf="options.theme === 'dark'">
        <img
          src="./assets/images/logos/AP-removebg-preview.png"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}

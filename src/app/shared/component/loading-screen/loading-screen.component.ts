import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppUtilsService } from '@shared/utils/app-utils.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-loading-screen',
  styleUrl: './loading-screen.component.scss',
  templateUrl: './loading-screen.component.html',
})
export class LoadingScreenComponent {
  constructor(public appUtils: AppUtilsService) {}
}

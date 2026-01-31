import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  imports: [IonIcon, CommonModule]
})
export class ImageUploadComponent  implements OnInit {
  @Input() imageDisplay: string | null = null;
  @Input() class: string = 'w-56 h-56';
  @Output() imageChange = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {}

  onFileChange(event: Event) {
    this.imageChange.emit(event);
  }

    onImageLoad(): void {
    console.log('✅ Image loaded successfully in DOM');
  }

  onImageError(event: Event): void {
    console.error('❌ Image failed to load in DOM:', event);
    console.error('❌ Current imageDisplay value:', this.imageDisplay);
  }


}

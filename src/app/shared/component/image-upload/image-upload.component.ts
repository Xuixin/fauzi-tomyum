import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
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
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() imageChange = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>(); // เพิ่ม output สำหรับลบรูป

  @ViewChild('fileInput') fileInput!: ElementRef;

  cssClass: string = '';

  constructor() { }

  ngOnInit() {
    this.cssClass = this.buildClass();
  }

  onFileChange(event: Event) {
    this.imageChange.emit(event);
  }

  // Public method เพื่อให้ parent component เรียกใช้ได้
  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  // Handle click on delete button inside hover overlay
  onClear(event: Event) {
    event.stopPropagation(); // ป้องกันไม่ให้ trigger file input preview
    this.clear.emit();
  }

  onImageLoading(): void {
    // console.log('Image loading...');
  }

  onImageError(event: Event): void {
    console.error('❌ Image failed to load in DOM:', event);
  }

  buildClass() {
    switch (this.size) {
      case 'sm':
        return 'w-32 h-32';
      case 'md':
        return 'w-56 h-56';
      case 'lg':
        return 'w-80 h-80';
    }
  }
}

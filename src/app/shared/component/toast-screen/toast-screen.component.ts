import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-toast-screen',
  standalone: true,
  imports: [CommonModule, ToastModule],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./toast-screen.component.scss'],
  template: `
    <p-toast
      styleClass="p-4 select-none"
      [baseZIndex]="99999"
      [breakpoints]="{ '920px': { width: '100%', right: '0', left: '0' } }"
    >
      <ng-template let-message pTemplate="message">
        <!-- API Response Template -->
        <ng-container
          *ngIf="isApiResponse(message.detail); else standardTemplate"
        >
          <div class="toast-content">
            <!-- Header with Status Badge -->
            <div class="toast-header">
              <div
                [ngClass]="getIconContainerClass(message.severity)"
                class="toast-icon"
              >
                <span [innerHTML]="getIconSvg(message.severity)"></span>
              </div>
              <div class="toast-title">
                <div class="flex items-center gap-1">
                  <h4>{{ message.summary || 'Notification' }}</h4>
                  <span
                    *ngIf="getDetails(message.detail).statusCode"
                    [ngClass]="
                      getStatusBadgeClass(getDetails(message.detail).statusCode)
                    "
                    class="status-badge"
                  >
                    {{ getDetails(message.detail).statusCode }}
                  </span>
                  <span
                    *ngIf="getDetails(message.detail).method"
                    class="method-badge"
                  >
                    {{ getDetails(message.detail).method }}
                  </span>
                </div>
                <span class="toast-timestamp">
                  {{ getDetails(message.detail).timestamp }}
                </span>
              </div>
            </div>

            <!-- Message -->
            <div class="toast-message-content">
              {{ getDetails(message.detail).message || 'N/A' }}
            </div>

            <!-- URL (แสดงเฉพาะเมื่อเป็น error) -->
            <div *ngIf="getDetails(message.detail).url" class="toast-url">
              <span class="url-label">URL:</span>
              <span class="url-value">
                {{ getDetails(message.detail).url }}
              </span>
            </div>
          </div>
        </ng-container>

        <!-- Standard Template -->
        <ng-template #standardTemplate>
          <div class="toast-content standard">
            <div
              [ngClass]="getIconContainerClass(message.severity)"
              class="toast-icon"
            >
              <span [innerHTML]="getIconSvg(message.severity)"></span>
            </div>
            <div class="toast-message">
              <h4>{{ message.summary || 'Notification' }}</h4>
              <p>{{ message.detail || '' }}</p>
            </div>
          </div>
        </ng-template>
      </ng-template>
    </p-toast>
  `,
})
export class ToastScreenComponent {
  constructor(private sanitizer: DomSanitizer) {}

  // SVG icons for each severity
  private readonly severitySvgMap: Record<string, string> = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    warn: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  };

  private readonly severityContainerClassMap: Record<string, string> = {
    success: 'bg-green-100 text-green-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
    warn: 'bg-amber-100 text-amber-600',
  };

  // Get SVG icon as SafeHtml
  getIconSvg(severity: string): SafeHtml {
    const svg = this.severitySvgMap[severity] || this.severitySvgMap['info'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  // Detects JSON-shaped details early; returns false for plain strings.
  isApiResponse(detail: string): boolean {
    if (!detail) return false;
    const startsLikeJson = detail.startsWith('{') || detail.startsWith('[');
    if (!startsLikeJson) return false;

    try {
      const parsed = JSON.parse(detail);
      return (
        typeof parsed === 'object' &&
        (parsed.statusCode !== undefined ||
          parsed.method !== undefined ||
          parsed.url !== undefined ||
          parsed.timestamp !== undefined)
      );
    } catch {
      return false;
    }
  }

  // Normalizes incoming detail into a consistent structure for binding.
  getDetails(detail: string) {
    const fallback = {
      timestamp: new Date().toLocaleTimeString(),
      statusCode: 0,
      message: detail || '',
      url: '',
      method: '',
    };

    const looksJson =
      detail && (detail.startsWith('{') || detail.startsWith('['));
    if (!looksJson) return fallback;

    try {
      const parsed = JSON.parse(detail);
      return { ...fallback, ...parsed };
    } catch {
      return fallback;
    }
  }

  // Returns Tailwind classes for the icon container background and text.
  getIconContainerClass(severity: string) {
    return (
      this.severityContainerClassMap[severity] || 'bg-blue-100 text-blue-600'
    );
  }

  // Returns Tailwind classes for the HTTP status badge based on numeric code.
  getStatusBadgeClass(status: number) {
    if (status >= 200 && status < 300) return 'bg-emerald-600';
    if (status >= 400 && status < 500) return 'bg-amber-600';
    if (status >= 500) return 'bg-rose-600';
    return 'bg-slate-600';
  }
}

import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AppUtilsService {


  // Loading state
  private loadingState = signal<boolean>(false);
  private loadingMessage = signal<string>('กำลังโหลด...');

  // Readonly signals for public access
  readonly isLoading$ = this.loadingState;
  readonly loadingMessage$ = this.loadingMessage;


  /**
   * Show the loading indicator with an optional message
   * @param message The message to display while loading
   */
  showLoading(message = 'กรุณารอสักครู่') {
    this.loadingMessage.set(message);
    this.loadingState.set(true);
  }

  /**
   * Hide the loading indicator immediately
   */
  hideLoading() {
    setTimeout(() => {
      this.loadingState.set(false);
    }, 300);
  }

}

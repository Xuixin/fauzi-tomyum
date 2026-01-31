export class FileHelper {



  static convertBase64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([uintArray], { type: 'image/jpeg' });
  }


  static createObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }

  static revokeObjectURL(url: string): void {
    URL.revokeObjectURL(url);
  }


}

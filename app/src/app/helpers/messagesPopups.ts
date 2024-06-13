import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessagesPopups {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  // En tu componente
  messageQueue: string[] = [];

  constructor(
    private _snackBar: MatSnackBar
  ) {

  }

  // popupMessage(message: string) {
  //   this._snackBar.open(message, 'OK', {
  //     horizontalPosition: this.horizontalPosition,
  //     verticalPosition: this.verticalPosition,
  //     duration: 2000,
  //   });

  // }

  popupMessage(message: string) {
    this.messageQueue.push(message);
    if (this.messageQueue.length === 1) {
      this.showNextMessage();
    }
  }
  
  private showNextMessage() {
    if (this.messageQueue.length > 0) {
      const message = this.messageQueue[0];
      this._snackBar.open(message, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2000,
      }).afterDismissed().subscribe(() => {
        this.messageQueue.shift(); // Elimina el mensaje actual de la cola
        this.showNextMessage();    // Muestra el próximo mensaje en la cola
      });
    }
  }
  
}
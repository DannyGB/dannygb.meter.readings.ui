import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-popup',
  templateUrl: './simple-popup.component.html',
  styleUrls: ['./simple-popup.component.css']
})
export class SimplePopupComponent {
  constructor(
    public dialogRef: MatDialogRef<SimplePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}

export interface SimpleDialogData {
  title: string,
  content: string | undefined
}
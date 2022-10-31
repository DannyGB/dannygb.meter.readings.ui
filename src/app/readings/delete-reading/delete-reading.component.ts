import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-reading',
  templateUrl: './delete-reading.component.html',
})
export class DeleteReadingComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteReadingComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}

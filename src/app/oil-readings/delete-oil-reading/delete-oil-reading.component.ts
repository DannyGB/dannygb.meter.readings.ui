import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-oil-reading',
  templateUrl: './delete-oil-reading.component.html'
})
export class DeleteOilReadingComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteOilReadingComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}

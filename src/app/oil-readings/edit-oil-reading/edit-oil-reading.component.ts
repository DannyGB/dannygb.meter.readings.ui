import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OilReading } from '../models/oil-reading.model';

@Component({
  selector: 'app-edit-oil-reading',
  templateUrl: './edit-oil-reading.component.html',
  styleUrls: ['./edit-oil-reading.component.css']
})
export class EditOilReadingComponent {
  constructor(
    public dialogRef: MatDialogRef<EditOilReadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OilReading,
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
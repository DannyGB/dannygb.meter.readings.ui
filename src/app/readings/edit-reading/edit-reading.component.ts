import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reading } from '../models/reading.model';

@Component({
  selector: 'app-edit-reading',
  templateUrl: './edit-reading.component.html',
  styleUrls: ['./edit-reading.component.css']
})
export class EditReadingComponent {

  public newReadingFormControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<EditReadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Reading,
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OilReading } from '../../state/oil-reading.model';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-new-oil-reading',
  templateUrl: './new-oil-reading.component.html',
  styleUrls: ['./new-oil-reading.component.css']
})
export class NewOilReadingDialog {

public newReadingFormControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<NewOilReadingData>,
    @Inject(MAT_DIALOG_DATA) public data: NewOilReadingData,
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface NewOilReadingData extends OilReading {
  lastReading: number,
}

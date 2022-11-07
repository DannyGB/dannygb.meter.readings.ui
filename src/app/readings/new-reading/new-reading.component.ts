import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Reading } from "../readings.model";

@Component({
    selector: 'new-reading-dialog',
    templateUrl: 'new-reading.component.html',
    styleUrls: ['new-reading.component.css']
  })
  export class NewReadingDialog {

    public newReadingFormControl = new FormControl('');

    constructor(
      public dialogRef: MatDialogRef<NewReadingDialog>,
      @Inject(MAT_DIALOG_DATA) public data: NewReadingData,
    ) {}
  
    public onNoClick(): void {
      this.dialogRef.close();
    }
  }

  export interface NewReadingData {
    dayReading: Reading,
    nightReading: Reading,
    lastDayReading: number,
    lastNightReading: number
  }
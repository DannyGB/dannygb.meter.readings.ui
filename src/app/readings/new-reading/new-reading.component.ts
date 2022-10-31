import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Reading } from "../readings.model";

@Component({
    selector: 'new-reading-dialog',
    templateUrl: 'new-reading.component.html',
  })
  export class NewReadingDialog {
    constructor(
      public dialogRef: MatDialogRef<NewReadingDialog>,
      @Inject(MAT_DIALOG_DATA) public data: NewReadingData,
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }

  export interface NewReadingData {
    reading: Reading,
    lastReading: number
  }
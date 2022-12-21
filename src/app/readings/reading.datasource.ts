import { Store } from "@ngrx/store";
import { combineLatestWith, zipWith } from "rxjs";
import { Reading } from "./models/reading.model";
import { ReadingsService } from "./readings.service";
import { retrievedReadingList } from "../state/app.actions";
import { selectReadings } from "../state/app.selectors";
import { BaseMatTableDataSource } from "../shared/MatTableDataSource/base-mattable-datasource";

export class ReadingDataSource extends BaseMatTableDataSource<Reading> {

    constructor(
        private readingsService: ReadingsService,
        private store: Store) {
        super();
    }

    public override loadData() {
        this.getReadings();
        this.store.select(selectReadings)
            .subscribe((data: Reading[]) => this.data = data);

        super.loadData();
    }    

    private getReadings(): void {
        this.pageEvent$.pipe(combineLatestWith(this.sortEvent$, this.filterEvent$))
        .subscribe((pe: any) => {
            this.readingsService.getReadings({ 
                skip: this.getSkip(pe[0]),
                take: pe[0].pageSize,
                sortDirection: pe[1].direction,
                filterText: pe[2].filterText
            }).pipe(zipWith(this.readingsService.getReadingCount(pe[2].filterText)))
            .subscribe({
                next: val => {
                    this.totalReadings$.next(val[1]);
                    this.store.dispatch(retrievedReadingList({ readings: val[0] }))
                    this.loadComplete$.next();
                },
                error: err => { 
                    this.totalReadings$.next(0);
                    this.store.dispatch(retrievedReadingList({ readings: [] }))
                    this.loadComplete$.next();
                }
            });
        });
      }
}
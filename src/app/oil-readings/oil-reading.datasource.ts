import { Store } from "@ngrx/store";
import { combineLatestWith, zipWith } from "rxjs";
import { OilReadingsService } from "./oil-readings.service";
import { retrievedOilReadingList } from "../state/app.actions";
import { selectOilReadings } from "../state/app.selectors";
import { OilReading } from '../state/oil-reading.model';
import { BaseMatTableDataSource } from "../shared/MatTableDataSource/base-mattable-datasource";

export class OilReadingDataSource extends BaseMatTableDataSource<OilReading> {

    constructor(
        private readingsService: OilReadingsService,
        private store: Store) {
        super();
    }

    public override loadData() {
        this.getReadings();
        this.store.select(selectOilReadings)
            .subscribe({
                next: (data: OilReading[]) => this.data = data,
                error: err => console.error(`Error: ${err}`)
            });

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
                    this.store.dispatch(retrievedOilReadingList({ oilReadings: val[0] }))
                    this.loadComplete$.next();
                },
                error: err => { 
                    this.totalReadings$.next(0);
                    this.store.dispatch(retrievedOilReadingList({ oilReadings: [] }))
                    this.loadComplete$.next();
                }
            });
        });
      }
}
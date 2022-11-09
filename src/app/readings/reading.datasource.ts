import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import * as moment from "moment";
import { BehaviorSubject, combineLatestWith, Subject, zip, zipWith } from "rxjs";
import { Reading } from "../state/reading.model";
import { ReadingsService } from "./readings.service";
import { retrievedReadingList } from "../state/app.actions";
import { selectReadings } from "../state/app.selectors";

export interface SortEvent {
    direction: string,
}

export interface FilterEvent {
    filterText: string,
}

export class ReadingDataSource extends MatTableDataSource<Reading> {

    public loadComplete$: Subject<void> = new Subject<void>();

    public pageEvent$: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(
    {
        length: 0,
        pageIndex: 0,
        pageSize: 50
    });

    public sortEvent$: BehaviorSubject<SortEvent> = new BehaviorSubject<SortEvent>(
    {
        direction: "desc"
    });

    public filterEvent$: BehaviorSubject<FilterEvent> = new BehaviorSubject<FilterEvent>(
    {
        filterText: ""
    });

    public totalReadings$: Subject<number> = new Subject<number>();

    constructor(
        private readingsService: ReadingsService,
        private store: Store) {
        super();
    }

    public loadData() {
        this.getReadings();
        this.store.select(selectReadings)
            .subscribe((data: Reading[]) => this.data = data);

        super.filterPredicate = this.readingFilterPredicate;
    }

    private readingFilterPredicate(data: Reading, filter: string): boolean {
        const dataStr = Object.keys(data as unknown as Record<string, any>)
                .reduce((currentTerm: string, key: string) => {

                    if((data as unknown as Record<string, any>)[key] instanceof moment) {
                        return currentTerm + (data as unknown as Record<string, any>)[key].toString() + '◬';
                    }
                    
                    return currentTerm + (data as unknown as Record<string, any>)[key] + '◬';
                }, '')
                .toLowerCase();

                const transformedFilter = filter.trim().toLowerCase();

                return dataStr.indexOf(transformedFilter) != -1;
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

      private getSkip(pe: PageEvent): number { return pe.pageIndex * pe.pageSize; }
}
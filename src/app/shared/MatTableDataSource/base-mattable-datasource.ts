import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import * as moment from "moment";
import { Subject, BehaviorSubject } from "rxjs";
import { SortEvent, FilterEvent } from "./datasource-events";

export class BaseMatTableDataSource<T> extends MatTableDataSource<T> {

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

    constructor() {
        super();
    }

    public loadData(): void {
        super.filterPredicate = this.readingFilterPredicate;
    }    

    private readingFilterPredicate(data: unknown, filter: string): boolean {
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

    protected getSkip(pe: PageEvent): number { return pe.pageIndex * pe.pageSize; }
}
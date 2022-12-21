import { Subject, BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

export class ListService<T> {

    public totalReadings$: Subject<number> = new Subject<number>();
    public loadComplete$: Subject<T> = new Subject<T>();
    public destroy$: Subject<void> = new Subject<void>();
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
}

export interface FilterEvent {
    filterText: string,
}

export interface SortEvent {
    direction: string,
}

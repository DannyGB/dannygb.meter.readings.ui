import { MatTableDataSource } from "@angular/material/table";
import * as moment from "moment";

export class BaseMatTableDataSource<T> extends MatTableDataSource<T> {

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
}
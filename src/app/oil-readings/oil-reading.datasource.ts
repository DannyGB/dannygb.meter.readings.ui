import { Store } from "@ngrx/store";
import { combineLatestWith, zipWith } from "rxjs";
import { OilReadingsService } from "./oil-readings.service";
import { retrievedOilReadingList } from "../state/app.actions";
import { selectOilReadings } from "../state/app.selectors";
import { OilReading } from './models/oil-reading.model';
import { BaseMatTableDataSource } from "../shared/MatTableDataSource/base-mattable-datasource";

export class OilReadingDataSource extends BaseMatTableDataSource<OilReading> {

    constructor() {
        super();
    }

    public override loadData(data?: any[]) {
        this.data = data ?? [];
        super.loadData();
    }    
}
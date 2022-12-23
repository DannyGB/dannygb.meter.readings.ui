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
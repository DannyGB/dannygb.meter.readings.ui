import { Reading } from "./models/reading.model";
import { BaseMatTableDataSource } from "../shared/MatTableDataSource/base-mattable-datasource";

export class ReadingDataSource extends BaseMatTableDataSource<Reading> {

    constructor() {
        super();
    }

    public override loadData(data?: Reading[]) {
        this.data = data ?? [];
        super.loadData();
    }
}
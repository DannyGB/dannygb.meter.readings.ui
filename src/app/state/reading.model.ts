import { BaseReading } from './base-reading.model';

export interface Reading extends BaseReading  {
    reading: number;
    readingdate: moment.Moment;
    rate: string;
}
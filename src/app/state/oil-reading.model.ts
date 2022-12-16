import { BaseReading } from './base-reading.model';

export interface OilReading extends BaseReading {
    volume: number;
    cost: number;
    date: moment.Moment;
}
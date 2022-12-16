import { createFeatureSelector } from '@ngrx/store';
import { OilReading } from './oil-reading.model';
import { Reading } from './reading.model';
import { User } from './user.model';

export const selectReadings = createFeatureSelector<Array<Reading>>('readings');
export const selectOilReadings = createFeatureSelector<Array<OilReading>>('oilReadings');
export const selectUser = createFeatureSelector<User>('user');

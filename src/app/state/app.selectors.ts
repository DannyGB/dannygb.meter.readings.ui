import { createFeatureSelector } from '@ngrx/store';
import { OilReading } from '../oil-readings/models/oil-reading.model';
import { Reading } from '../readings/models/reading.model';
import { User } from '../login/models/user.model';

export const selectReadings = createFeatureSelector<Array<Reading>>('readings');
export const selectOilReadings = createFeatureSelector<Array<OilReading>>('oilReadings');
export const selectUser = createFeatureSelector<User>('user');

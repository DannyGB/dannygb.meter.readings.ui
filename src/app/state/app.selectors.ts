import { createFeatureSelector } from '@ngrx/store';
import { Reading } from './reading.model';
import { User } from './user.model';

export const selectReadings = createFeatureSelector<Array<Reading>>('readings');
export const selectUser = createFeatureSelector<User>('user');

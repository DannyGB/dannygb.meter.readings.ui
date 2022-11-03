import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Reading } from '../readings.model';

export const selectReadings = createFeatureSelector<Array<Reading>>('readings');

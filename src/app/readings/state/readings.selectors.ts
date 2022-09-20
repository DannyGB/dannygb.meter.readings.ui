import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Reading } from '../readings.model';

export const selectReadings = createFeatureSelector<Array<Reading>>('readings');

export const selectCollectionState = createFeatureSelector<Array<string>>('collection');

export const selectReadingCollection = createSelector(
  selectReadings,
  selectCollectionState,
  (readings, collection) => {
    return collection.map((id) => readings.find((reading) => reading._id === id));
  }
);
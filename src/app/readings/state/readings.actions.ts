import { createAction, props } from '@ngrx/store';
import { Reading } from '../readings.model';
 
export const addReading = createAction(
  '[Reading List] Add Reading',
  props<{ reading: Reading }>()
);
 
export const removeReading = createAction(
  '[Reading Collection] Remove Reading',
  props<{ readingId: string }>()
);
 
export const retrievedReadingList = createAction(
  '[Reading List/API] Retrieve Readings Success',
  props<{ readings: Array<Reading> }>()
);
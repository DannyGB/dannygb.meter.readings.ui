import { createAction, props } from '@ngrx/store';
import { Reading } from './reading.model';
import { OilReading } from './oil-reading.model';
import { User } from './user.model';
 
export const addReading = createAction(
  '[Reading List] Add Reading',
  props<{ reading: Reading }>()
);
 
export const removeReading = createAction(
  '[Reading Collection] Remove Reading',
  props<{ readingId: string }>()
);
 
export const retrievedReadingList = createAction(
  'Retrieve Readings Success',
  props<{ readings: Array<Reading> }>()
);

export const setUser = createAction(
  'Set the username',
  props<{ user: User }>()
);

export const addOilReading = createAction(
  '[Reading List] Add Oil Reading',
  props<{ reading: OilReading }>()
);
 
export const removeOilReading = createAction(
  '[Reading Collection] Remove Oil Reading',
  props<{ readingId: string }>()
);
 
export const retrievedOilReadingList = createAction(
  'Retrieve Oil Readings Success',
  props<{ oilReadings: Array<OilReading> }>()
);
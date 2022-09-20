import { createReducer, on } from '@ngrx/store';

import { addReading, retrievedReadingList } from './readings.actions';
import { Reading } from '../readings.model';

export const initialState: ReadonlyArray<Reading> = [];

export const readingsReducer = createReducer(
  initialState,
  on(retrievedReadingList, (state, { readings }) => readings),
  on(addReading, (state, { reading }) => {
    
    if(!!!reading.reading || reading.reading <= 0) {
      return state;
    }

    return [...state, reading];
  })
);

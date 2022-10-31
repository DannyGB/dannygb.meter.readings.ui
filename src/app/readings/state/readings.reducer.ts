import { createReducer, on } from '@ngrx/store';
import { addReading, removeReading, retrievedReadingList } from './readings.actions';
import { Reading } from '../readings.model';

export const initialState: Array<Reading> = [];

export const readingsReducer = createReducer(
  initialState,
  on(retrievedReadingList, (state, { readings }) => readings),
  on(addReading, (state, { reading }) => {
    
    if(!!!reading.reading || reading.reading < 0) {
      return state;
    }

    return [reading, ...state];
  }),
  on(removeReading, (state, { readingId }) => {
    return [...state.filter(e => e._id !== readingId)];
  })
);

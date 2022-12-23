import { createReducer, on } from '@ngrx/store';
import { addOilReading, addReading, editOilReading, editReading, removeOilReading, removeReading, retrievedOilReadingList, retrievedReadingList, setUser } from './app.actions';
import { OilReading } from '../oil-readings/models/oil-reading.model';
import { Reading } from '../readings/models/reading.model';
import { User } from '../login/models/user.model';

export const initialState: Array<Reading> = [];

export const readingsReducer = createReducer(
  initialState,
  on(retrievedReadingList, (state, { readings }) => {
    return readings;
  }),
  on(addReading, (state, { reading }) => {
    
    if(!!!reading.reading || reading.reading < 0) {
      return state;
    }

    return [reading, ...state];
  }),
  on(removeReading, (state, { readingId }) => {
    return [...state.filter(e => e._id !== readingId)];
  }),
  on(editReading, (state, { reading }) => {
    const s = [...state].filter(e => e._id !== reading._id);
    return [reading, ...s];
  })
);

export const initialOilState: Array<OilReading> = [];
export const oilReadingsReducer = createReducer(
  initialOilState,
  on(retrievedOilReadingList, (state, { oilReadings }) => {
    return oilReadings;
  }),
  on(addOilReading, (state, { reading }) => {
    
    if(!!!reading.volume || reading.volume < 0) {
      return state;
    }

    return [reading, ...state];
  }),
  on(removeOilReading, (state, { readingId }) => {
    return [...state.filter(e => e._id !== readingId)];
  }),
  on(editOilReading, (state, { reading }) => {
    const s = [...state].filter(e => e._id !== reading._id);
    return [reading, ...s];
  })
);

export const initialUserState: User = { name: undefined, userName: undefined };
export const userReducer = createReducer(
  initialUserState,
  on(setUser, (state, { user }) => {
    const newstate = { ...state };
    newstate.name = user.name;
    newstate.userName = user.userName;

    return newstate;
  }),
);

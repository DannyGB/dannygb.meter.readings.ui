import { createReducer, on } from '@ngrx/store';
import { addReading, removeReading, retrievedReadingList, setUser } from './app.actions';
import { Reading } from './reading.model';
import { User } from './user.model';

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

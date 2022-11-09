import { User } from './user.model';
import { Reading } from './reading.model';

export interface AppState {  
  readings: Array<Reading>;
  user: User;
}
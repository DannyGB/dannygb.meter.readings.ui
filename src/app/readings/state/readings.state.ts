import { User } from 'src/app/login/user.model';
import { Reading } from '../readings.model';

export interface AppState {
  readings: Array<Reading>;
  user: User;
}
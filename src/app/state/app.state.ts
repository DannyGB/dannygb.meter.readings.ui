import { User } from './user.model';
import { Reading } from './reading.model';
import { OilReading } from './oil-reading.model';

export interface AppState {  
  readings: Array<Reading>;
  oilReadings: Array<OilReading>;
  user: User;
}
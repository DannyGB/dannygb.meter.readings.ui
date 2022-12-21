import { User } from '../login/models/user.model';
import { Reading } from '../readings/models/reading.model';
import { OilReading } from '../oil-readings/models/oil-reading.model';

export interface AppState {  
  readings: Array<Reading>;
  oilReadings: Array<OilReading>;
  user: User;
}
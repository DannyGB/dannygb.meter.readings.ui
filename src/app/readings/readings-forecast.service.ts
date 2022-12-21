import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { addReading, removeReading } from '../state/app.actions';
import { Reading } from './models/reading.model';
import { User } from '../login/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ReadingsForecastService {

  constructor(private store: Store) { }

  public calculateForecast(data: Reading[], forecastApplied: boolean, user: User | undefined) : void {

    if(forecastApplied) {

      // find last years usage for next month (or nearest) and add that to the list

      const nightData = [...data].filter(reading => {
        return reading.rate === "Night";
      }).sort((a,b) => {
        return a < b ? 1 : -1;
      });
      const dayData = [...data].filter(reading => {
        return reading.rate === "Day";
      }).sort((a,b) => {
        return a < b ? 1 : -1;
      });

      const lastRealNightReading = nightData[0];
      const lastRealDayReading = dayData[0];

      let lastMonthNight = nightData.findIndex(reading => {
        const d = moment(moment().add(-1, "y")).add(1, "M");
        return reading.readingdate.month() === d.month() && reading.readingdate.year() === d.year();
      });

      let lastMonthDay = dayData.findIndex(reading => {
        const d = moment(moment().add(-1, "y")).add(1, "M");
        return reading.readingdate.month() === d.month() && reading.readingdate.year() === d.year();
      });

      if(!lastMonthNight || !lastMonthDay 
          || lastMonthNight > (nightData.length-1)
          || lastMonthDay > (dayData.length-1)) {
        return;
      }

      const dayDiff = dayData[lastMonthDay].readingdate.diff(dayData[lastMonthDay+1].readingdate, "days");

      this.store.dispatch(addReading({ reading: {
        _id: UUID.UUID(),
        reading: lastRealDayReading.reading + (dayData[lastMonthDay].reading - dayData[lastMonthDay+1].reading),
        readingdate: moment(lastRealDayReading.readingdate).add(dayDiff, "days"),
        note: "forecast",
        rate: "Day",
        userName: user?.userName || ""
      } }));
      this.store.dispatch(addReading({ reading: {
        _id: UUID.UUID(),
        reading: lastRealNightReading.reading + (nightData[lastMonthNight].reading - nightData[lastMonthNight+1].reading),
        readingdate: moment(lastRealNightReading.readingdate).add(dayDiff, "days"),
        note: "forecast",
        rate: "Night",
        userName: user?.userName || ""
      } }));    
    } else {
      const ids = data.filter(reading => {
        return reading.note === "forecast";
      }).flatMap(reading => reading._id)
      .forEach(id => {
        this.store.dispatch(removeReading({readingId: id}))
      });
    }  
  }
}

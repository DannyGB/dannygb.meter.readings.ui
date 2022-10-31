import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: Config | undefined;
    
  constructor(private http: HttpClient) {}
  
  loadConfig(): Observable<Config> {

    if(this.config) {
      return of(this.config);
    }

    return this.http
      .get<Config>('./assets/config.json')
      .pipe(map((config) => {
        this.config = config;
        return this.config
      }));
  }
}

export interface Config {
  apiUrl: string
}
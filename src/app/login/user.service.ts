import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { selectUser } from 'src/app/state/app.selectors';
import { Store } from '@ngrx/store';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: { name: string, userName: string } = { name: "", userName: "" };

  constructor(private store: Store) { }

  public getUser(): Observable<User> {
    return this.store.select(selectUser);
  }

}

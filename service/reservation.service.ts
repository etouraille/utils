import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Store} from "@ngrx/store";
import {increase} from "../actions/book-action";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    private http: HttpClient,
    private toastR: ToastrService,
    private store: Store<{ login: any}>,
  ) { }

  book(dates: any, thing: any, payment: boolean) {
    if(!dates.endDate) {
      dates.endDate = dates.startDate;
    }
    dates = Object.assign(dates, { thing:  'api/things/' + thing.id, state: payment ? -2 : 0 });

    let observer  = {
      next: (reservation: any) => {
        thing.reservations.push(reservation);
        this.store.dispatch(increase());
        this.toastR.success('Réservation prise en compte');
      },
      error: (error: any) => {
        this.toastR.error('Erreur lors de la reservation');
      }
    };
    return this.http.post('api/reservations', dates).subscribe(observer);
  }
}

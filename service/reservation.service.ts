import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    private http: HttpClient,
    private toastR: ToastrService,
  ) { }

  book(dates: any, thing: any) {
    if(!dates.endDate) {
      dates.endDate = dates.startDate;
    }
    dates = Object.assign(dates, { thing:  'api/things/' + thing.id });

    let observer  = {
      next: (reservation: any) => {
        thing.reservations.push(reservation);
        this.toastR.success('Réservation prise en compte');
      },
      error: (error: any) => {
        this.toastR.error('Erreur lors de la reservation');
      }
    };
    return this.http.post('api/reservations', dates).subscribe(observer);
  }
}

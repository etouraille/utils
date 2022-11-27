import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import * as moment from 'moment';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  myControl: FormControl = new FormControl<any>('');
  filteredOptions: any[] = [];
  displayFn(thing: any) {
    return thing.name;
  };

  @Input() user : any = null;
  @Input() things : any[] = [];
  @Input() all: boolean = false;

  @Output() onChangeId: EventEmitter<number> = new EventEmitter<number>();

  constructor(private http: HttpClient  ) {

  }

  isReserved(reservation: any) : boolean {
    let _startDate = moment(reservation.startDate);
    let _endDate = moment(reservation.endDate);
    let _now = moment();

    // if user is defined
    let condition = !reservation.state;
    if(this.user) {
      condition = !reservation.state && reservation.owner.id !== this.user.id
    }

    return (reservation.state == 1 || condition)
      && _now.isSameOrAfter(_startDate, 'day')
      && _now.isSameOrBefore(_endDate, 'day')
    ;
  }

  includeReserved(reservations: any) {
    let ret = false;
    reservations.forEach((reservation:any) => {
      if(this.isReserved(reservation)) {
        ret = true;
      }
    });
    return ret;
  }

  ngOnInit(): void {
    // @ts-ignore
    this.myControl.valueChanges
      // @ts-ignore
      .subscribe((value:any) => {
        if(value.length >= 1){
          this.http.get('api/things?name=' + value + '&description=' + value)
            .pipe(
              map((data:any ) => data['hydra:member']),
              map((data: any) => {
                // on ne prends que ceux disponible.
                // cad que ceux qui ne sont pas out à la date courante
                return this.all ? data : data
                  .filter((elem:any) => !this.things.map(elem => elem.id).includes(elem.id))
                  .filter((elem: any) => elem.reservations.length === 0 || !this.includeReserved(elem.reservations))
              })
            )
            .subscribe((response : any)  => {
            this.filteredOptions = response;
          });
        }
        else {
          return null;
        }
      })
  }

  onSelected(event:any) {
    this.onChangeId.emit(event.option.value);
  }
}

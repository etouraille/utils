import { Component, OnInit } from '@angular/core';
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {map, of, switchMap} from "rxjs";
import {set} from "../../actions/book-action";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent extends SubscribeComponent implements OnInit {

  isLogged: boolean = false;
  quantity: number = 0;

  constructor(
    private http: HttpClient,
    private store: Store<{login: any}>,
    ) {
    super();
  }

  ngOnInit(): void {

    this.add(this.store.select(data => data.login.book).subscribe((quantity: number) => {
      this.quantity = quantity;
    }))
    this.add(
      this.store.select((data:any) => data.login.logged).pipe(
        switchMap((logged: boolean) => {
          this.isLogged = logged;
          if(logged) {
            return this.http.get('api/waiting')
          } else {
            let object: any = {};
            object['hydra:member'] = [];
            return of(object);
          }
        }),
        map((object:any) => object['hydra:member'])
      ).subscribe((waiting:any) => {
          this.quantity = waiting.length;
          this.store.dispatch(set({ quantity: this.quantity}));
      })
    )
  }

}

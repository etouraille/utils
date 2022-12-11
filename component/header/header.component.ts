import {Component, Input, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectFeatureLogged} from "../../selectors/logged-selector";
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {login, logout} from "../../actions/login-action";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../service/storage.service";
import {available, unavailable} from "../../actions/payment-action";
import {FacebookLoginComponent} from "../facebook-login/facebook-login.component";
declare const FB : any
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends SubscribeComponent implements OnInit {

  logged: boolean = true;
  email: string = '';
  isMember: boolean = false;

  @Input() large: boolean = false;

  constructor(
    private store: Store<{logged: boolean}>,
    private router: Router,
    private service: StorageService,
    private http: HttpClient,

  ) {
    super();
  }

  ngOnInit(): void {
    this.add(this.store.select((state:any) => state.login.logged).subscribe(data => {
        this.logged = data;
    }));
    this.add(this.store.select((state:any) => state.login.user).subscribe(data => {
      this.email = data?.email;
      this.isMember = data?.roles?.includes('ROLE_MEMBER');
    }));
    this.add(this.http.get('payment/front').subscribe((data: any) => {
      if(data.available) {
        this.store.dispatch(available());
      } else {
        this.store.dispatch(unavailable())
      }
    }))
    FacebookLoginComponent.init();
  }

  logout() {
    this.service.set('token', null);
    FB.getLoginStatus((response: any) => {
      if(response.status === 'connected') {
        FB.logout();
      }
    })

    if(this.router.url === '/') this.store.dispatch(logout());
    this.router.navigate(['/']);
  }

  selectThing($event: number) {
    this.router.navigate(['thing/' + $event]);
  }
}

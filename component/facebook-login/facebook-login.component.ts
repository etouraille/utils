import { Component, OnInit } from '@angular/core';
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {HttpClient} from "@angular/common/http";
import {Route, Router} from "@angular/router";
import {StorageService} from "../../service/storage.service";
import {ToastrService} from "ngx-toastr";
import {Store} from "@ngrx/store";
import {user} from "../../actions/user-action";
declare const FB : any
declare const window: any;

@Component({
  selector: 'app-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.scss']
})
export class FacebookLoginComponent extends SubscribeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private toastR: ToastrService,
    private store: Store<{ login: any}>
  ) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  login() {
    FB.login((response: any) => {
      console.log(response);
      if (response.status === 'connected') {
        this.add(this.http.post('facebook/signin', { token: response.authResponse.accessToken}).subscribe((data: any) => {
          if(data.token) {
            this.storage.set('token', data.token);
            this.store.dispatch(user({ user: {id: data.id , email: data.email}}));
            this.toastR.success('Connexion réussie');
            this.router.navigate(['/']);
          }
        }, (error) => this.toastR.error('Echec de la connexion')))
      }
    }, { scope: 'email'});
  }

  init() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1867394790282222',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.4'
      });
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      // @ts-ignore
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      // @ts-ignore
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

}

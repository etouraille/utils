import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {StorageService} from "../../service/storage.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {login} from "../../actions/login-action";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent extends SubscribeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private toastR: ToastrService,
    private storage: StorageService,
    private router: Router,
    private store: Store<{ login: any}>
  ) {
    super();
  }



  auth2: any;

  @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;


  /*------------------------------------------
  --------------------------------------------
  About
  --------------------------------------------
  --------------------------------------------*/
  ngOnInit() {

    this.googleAuthSDK();
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  callLoginButton() {

    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleAuthUser:any) => {

        let profile = googleAuthUser.getBasicProfile();
        console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        this.add(this.http.post('google/signin', { token: googleAuthUser.getAuthResponse().id_token}).subscribe((data: any) => {
          if(data.token) {
            this.storage.set('token', data.token);
            this.store.dispatch(login());
            this.router.navigate(['/']);
            this.toastR.success('Login réussi');
          }
        }, (error: any) => {
          this.toastR.error('Echec de la connexion');
        }));

          /* Write Your Code Here */

      }, (error:any) => {
        alert(JSON.stringify(error, undefined, 2));
      });

  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  googleAuthSDK() {

    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: environment.google,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.callLoginButton();
      });
    }

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement('script');
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));

  }
}

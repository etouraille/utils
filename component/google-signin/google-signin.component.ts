import { Component, OnInit } from '@angular/core';
import {GoogleLoginProvider, SocialAuthService} from "angularx-social-login";
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {StorageService} from "../../service/storage.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {login} from "../../actions/login-action";

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent extends SubscribeComponent implements OnInit {

  constructor(
    private socialAuthService: SocialAuthService,
    private http: HttpClient,
    private toastR: ToastrService,
    private storage: StorageService,
    private router: Router,
    private store: Store<{ login: any}>
  ) {
    super();
  }

  ngOnInit(): void {
  }

  signin(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data:any) => {
        console.log(data);
        this.add(this.http.post('google/signin', { token: data.idToken}).subscribe((data: any) => {
          if(data.token) {
            this.storage.set('token', data.token);
            this.store.dispatch(login());
            this.router.navigate(['/']);
            this.toastR.success('Login réussi');
          }
        }, (error: any) => {
          this.toastR.error('Echec de la connexion');
        }));
      });
  }
}

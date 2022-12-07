import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {StorageService} from "../../service/storage.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {login} from "../../actions/login-action";
import {environment} from "../../../environments/environment";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {RoleComponent} from "../role/role.component";

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent extends SubscribeComponent implements OnInit {

  @Input() setRole : boolean = false;

  ref: NgbModalRef|null = null;

  constructor(
    private http: HttpClient,
    private toastR: ToastrService,
    private storage: StorageService,
    private router: Router,
    private store: Store<{ login: any}>,
    private modalService: NgbModal,
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
  _callLoginButton() {


  }

  signin() {
      if(this.setRole) {
        this.ref = this.modalService.open(RoleComponent);
        this.ref.result.then((data: any) => {
          this._login({ roles: [data.role]});
        }, reason => console.log(reason));
      } else {
        this._login({});
      }

  }

  _login(params: any) {
    this.auth2.signIn().then((googleAuthUser: any) => {
      let profile = googleAuthUser.getBasicProfile();
      this.add(this.http.post('google/signin', {
        ...params,
        token: googleAuthUser.getAuthResponse().id_token
      }).subscribe((data: any) => {
        if (data.token) {
          this.storage.set('token', data.token);
          this.store.dispatch(login());
          this.router.navigate(['/']);
          this.toastR.success('Login réussi');
        }
      }, (error: any) => {
        this.toastR.error('Echec de la connexion');
      }));
    }, (error: any ) => this.toastR.error(error));

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

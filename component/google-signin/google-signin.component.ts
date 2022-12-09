import {AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core';
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
//import * as  gapi  from 'gapi-script';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
let option: any
@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent extends SubscribeComponent implements OnInit, AfterViewInit {

  @Input() setRole : boolean = false;

  ref: NgbModalRef|null = null;

  constructor(
    private http: HttpClient,
    private toastR: ToastrService,
    private storage: StorageService,
    private router: Router,
    private store: Store<{ login: any}>,
    private modalService: NgbModal,
    private zone: NgZone,
  ) {
    super();
  }

  options: any

  static auth: any;

  @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;


  /*------------------------------------------
  --------------------------------------------
  About
  --------------------------------------------
  --------------------------------------------*/
  ngOnInit() {


  }

  ngAfterViewInit() {

    this.googleAuthSDK();
  }


  signin() {

    // @ts-ignore
    google.accounts.id.prompt(
      (notification: PromptMomentNotification) => {
      console.log(notification);
    });
    /*
      if(this.setRole) {
        this.ref = this.modalService.open(RoleComponent);
        this.ref.result.then((data: any) => {
          this._login({ roles: [data.role]});
        }, reason => console.log(reason));
      } else {
        this._login({});
      }
    */
  }

  _login(response: any, params: any) {
    this.zone.run(() => {
      this.add(this.http.post('google/signin', {
        ...params,
        token: response.credential
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
    })

  }

  handleCredentialResponse(response: CredentialResponse ) {
    if(this.setRole) {
      this.ref = this.modalService.open(RoleComponent);
      this.ref.result.then((data: any) => {
        this._login(response, {roles: [data.role]});
      }, reason => console.log(reason));
    } else {
      this._login(response, {});
    }
  }



  googleAuthSDK() {

    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log('Google\'s One-tap sign in script loaded!');

      // @ts-ignore
      GoogleSigninComponent.auth = google.accounts.id.initialize({
        // Ref: https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
        client_id: environment.google,
        callback:  this.handleCredentialResponse.bind(this), // Whatever function you want to trigger...
        auto_select: true,
        cancel_on_tap_outside: false,
      });

      console.log(GoogleSigninComponent.auth);

    };


    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement('script');
      js.id = id;
      js.src = "https://accounts.google.com/gsi/client?onload=googleSDKLoaded";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));

  }
}

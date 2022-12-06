import { Component, OnInit } from '@angular/core';
declare const FB : any

@Component({
  selector: 'app-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.scss']
})
export class FacebookLoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  login() {
    FB.login(function(response: any) {
      if (response.satus === 'connected') {
        console.log(response);
      }
    }, {scope: 'public_profile,email'});
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

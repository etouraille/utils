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
  }

  login() {
    FB.login(function(response: any) {
      if (response.satus === 'connected') {
        console.log(response);
      }
    }, {scope: 'public_profile,email'});
  }

}

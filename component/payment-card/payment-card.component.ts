import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss']
})
export class PaymentCardComponent implements OnInit {

  constructor() { }

  expiration: string = '12/22';

  @Input() number: any = '1234';
  @Input() expirationYear : any = 2022;
  @Input() expirationMonth : any = 12;

  ngOnInit(): void {
    this.expiration = this.expirationMonth + '/' + ('' + this.expirationYear).substring(2,4);
  }

}

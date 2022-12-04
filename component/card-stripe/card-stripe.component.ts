import { Component, OnInit } from '@angular/core';
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {loadStripe} from '@stripe/stripe-js';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-card-stripe',
  templateUrl: './card-stripe.component.html',
  styleUrls: ['./card-stripe.component.scss']
})
export class CardStripeComponent extends SubscribeComponent implements OnInit {

  stripe : any;
  elements: any;
  redirect: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  async ngOnInit(){
    this.stripe = await loadStripe(environment.stripe);
    this.add(this.route.paramMap.subscribe((param: any) => {
      let secret = param.get('secret');
      this.elements = this.stripe.elements({ clientSecret: secret });

      const paymentElementOptions = {
        layout: "tabs",
      };

      const paymentElement = this.elements.create("payment", paymentElementOptions);
      paymentElement.mount("#payment-element");
    }))
    this.add(this.route.queryParams.subscribe((param: any) => {
      if(param.redirect) {
        this.redirect = param.redirect;
      }
    }))
    this.add(this.route.queryParams.subscribe(async(param: any) => {
      if(param.payment_intent_client_secret) {
        let clientSecret = param.payment_intent_client_secret;

        const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret);

        switch (paymentIntent.status) {
          case "succeeded":
            this.showMessage("Payment succeeded!");
            await this.router.navigate([this.redirect]);
            break;
          case "processing":
            this.showMessage("Your payment is processing.");
            await this.router.navigate([this.redirect]);
            break;
          case "requires_payment_method":
            this.showMessage("Your payment was not successful, please try again.");
            break;
          default:
            this.showMessage("Something went wrong.");
            break;
        }
      }
    }))
  }

  showMessage(messageText: string)   {
    const messageContainer = document.querySelector("#payment-message");

    // @ts-ignore
    messageContainer.classList.remove("hidden");
    // @ts-ignore
    messageContainer.textContent = messageText;

      setTimeout(function () {
        // @ts-ignore
        messageContainer.classList.add("hidden");
        // @ts-ignore
        messageText.textContent = "";
    }, 4000);
  }

// Show a spinner on payment submission
  setLoading(isLoading: boolean) {
    if (isLoading) {
      // Disable the button and show a spinner
      // @ts-ignore
      document.querySelector("#submit").disabled = true;
      // @ts-ignore
      document.querySelector("#spinner").classList.remove("hidden");
      // @ts-ignore
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      // @ts-ignore
      document.querySelector("#submit").disabled = false;
      // @ts-ignore
      document.querySelector("#spinner").classList.add("hidden");
      // @ts-ignore
      document.querySelector("#button-text").classList.remove("hidden");
    }
  }


async handleSubmit(event: Event) {

    event.preventDefault();
    this.setLoading(true);

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: environment.local + (environment.app === 'manager' ? 'logged/' : '/') + 'checkout',
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      this.showMessage(error.message);
    } else {
      this.showMessage("An unexpected error occurred.");
    }

    this.setLoading(false);
  }


}

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {SubscribeComponent} from "../subscribe/subscribe.component";

@Component({
  selector: 'app-who',
  templateUrl: './who.component.html',
  styleUrls: ['./who.component.scss']
})
export class WhoComponent extends SubscribeComponent implements OnInit {

  @Input() header: string = 'Pour quel utilisateur souhaitez vous emprunter un objet';

  myControl: FormControl = new FormControl<any>('');
  filteredOptions: any[] = [];

  displayFn(thing: any) {
    return thing.email;
  };

  @Output() onChangeId: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private http: HttpClient,
    private elt:ElementRef,

  ) {
    super();
  }

  ngOnInit(): void {
    // @ts-ignore

    this.myControl.valueChanges
      // @ts-ignore
      .subscribe((value:any) => {
        if(value.length >= 1){
          this.add(
            this.http.get('api/users?email=' + value + '&firstname=' + value + '&lastname=' + value).subscribe((response : any)  => {
              this.filteredOptions = response['hydra:member'];
            })
          );
        }
        else {
          return null;
        }
      })
  }

  onSelected(event:any) {
    this.onChangeId.emit(event.option.value.id);
  }
}

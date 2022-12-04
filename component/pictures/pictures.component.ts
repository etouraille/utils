import {Component, forwardRef, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {
  ControlValueAccessor,
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR
} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ToastrModule, ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PicturesComponent),
    multi: true
  }]
})
export class PicturesComponent extends SubscribeComponent implements OnInit, ControlValueAccessor{

  //form = this.fb.group({});

  cdn: string = environment.cdn;

  constructor(
    private http: HttpClient,
    private toastR: ToastrService,
  ) {
    super()
  }

  onTouch = () => {};
  onChange = (pictures: any[]) => {};

  _pictures : any[] = [];

  ngOnInit(): void {
  }
  writeValue(obj: any) {
    this._pictures = obj;
    //this.form.patchValue({ pictures: obj});
  }
  get   pictures() {
    return this._pictures;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  addPicture():void {
    this._pictures.push({ picture : ''});
    this.onChange(this._pictures);
  }
  removePicture(index: number): void {
    let pic = this._pictures[index].picture;
    this.add(this.http.delete(this.cdn + 'delete-picture/' + pic ).subscribe( {
      next: (data: any) => {
        if(data.success) {
          this._pictures.splice(index, 1);
          this.onChange(this._pictures);
          this.toastR.success('Image effacée');
        } else {
          this.toastR.success('Echec de la suppression');
        }
      },
      error: (error) => {
        this.toastR.success('Echec de la suppression');
      }
    }))


  }

  pictureChange(event: any, i: number) {
    this._pictures[i] = event;
    this.onChange(this._pictures);
  }
}

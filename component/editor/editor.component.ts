import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SubscribeComponent} from "../subscribe/subscribe.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditorComponent),
    multi: true
  }]
})
export class EditorComponent extends SubscribeComponent implements OnInit, ControlValueAccessor {

  form = this.fb.group({
    property: [''],
  });

  edit: boolean = false;
  model: any = {};
  @Input() field: string = '';
  @Input() type: string = 'string';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    ) {
    super();
  }
  onChange = (value: any) => {};
  onTouched = (value: any) => {};


  ngOnInit(): void {
    this.form.get('property')?.valueChanges.subscribe((value: any) => {
      let model = { ...this.model };
      model[this.field] = value;
      this.model = model;
      this.onChange(model)
    })
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  writeValue(obj: any) {
    if(obj) {
      this.model = obj;
      this.form.patchValue({property: this.model[this.field]});
    }
  }


  save() {
    this.edit = false;
    let object: any = {}
    object[this.field] = this.type=='price' ? parseFloat(this.model[this.field]) : this.model[this.field];
    this.add(this.http.patch('api/things/' + this.model.id, object).subscribe((data) => {
      this.model = data;
    }));
  }
}

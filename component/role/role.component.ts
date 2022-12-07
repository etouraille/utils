import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  form = this.fb.group({role: ['']});

  constructor(
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
  }

  submit() {
    this.activeModal.close({ role: this.form.value.role});
  }

}

import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-who-modal',
  templateUrl: './who-modal.component.html',
  styleUrls: ['./who-modal.component.scss']
})
export class WhoModalComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  onChangeId(id: number) {
    this.activeModal.close({id: id});
  }

}

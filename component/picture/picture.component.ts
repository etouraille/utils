import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss']
})
export class PictureComponent implements OnInit {

  constructor() { }

  @Input() pictures: any[] = [];

  cdn: string = environment.cdn;

  ngOnInit(): void {
  }

}

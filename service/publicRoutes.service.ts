import {Inject, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class publicRoutesService {
  constructor(@Inject('routes') private routes: any[]) {
  }

  get(): any[] {
    return this.routes;
  }
}


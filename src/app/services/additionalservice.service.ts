import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilitiesService } from './utility.service';

@Injectable({ providedIn: 'root' })

export class AdditionalServiceService {

  constructor(private _UtilitiesService: UtilitiesService, private httpClient: HttpClient) { 

  }

  List(url: string): Observable<any> {
    return this._UtilitiesService.getQuery(url, true).pipe(map((result: any) => result));
  }

  Get(url: string): Observable<any> {
    return this._UtilitiesService.getQuery(url, true).pipe(map((result: any) => result));
  }

  Create(url: string, data: any): Observable<any> {
    return this._UtilitiesService.postQuery(url, data).pipe(map((result: boolean) => { return result; }));
  }

  Update(url: string, data: any): Observable<any> {
    return this._UtilitiesService.putQuery(url, data).pipe(map((result: boolean) => { return result; }));
  }

  ChangeStatus(url: string): Observable<any> {
    return this._UtilitiesService.putQuery(url, true).pipe(map((result: boolean) => { return result; }));
  }

  Delete(url: string): Observable<any> {
    return this._UtilitiesService.deleteQuery(url).pipe(map((result: boolean) => { return result; }));
  }

}

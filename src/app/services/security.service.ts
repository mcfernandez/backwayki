import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilitiesService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor( private _UtilitiesService: UtilitiesService,
               private httpClient: HttpClient) { }

  getList(url:string): Observable<any> {
    //let url :string  = `user/list`;
    // return this._UtilitiesService.getQuery(url,true).pipe(map((respuesta: any) => respuesta ));
    return this._UtilitiesService.getQuery(url,true).pipe(map((respuesta: any) => respuesta));
  }

  postUser(data:any):Observable<any> {
    let url :string  = `user/add`;
    
    return this._UtilitiesService.postQuery(url,data)
         .pipe(map( (res:any) => {
            return true;
         }));
  }
  postRol(data:any):Observable<any> {
    let url :string  = `role/add`;
    return this._UtilitiesService.postQuery(url,data)
         .pipe(map( (res:any) => {
           console.log(res);
           return res.id
         }));
  }
  posModule(id:any,data:any):Observable<any>{
    let url :string  = `module/add/permission/${id}`;
    return this._UtilitiesService.postQuery(url,data)
    .pipe(map( (res:any) => {
       return true;
    }));
  }
  updateUser(data:any,url:string):Observable<any> {
    
    return this._UtilitiesService.putQuery(url,data)
         .pipe(map( (res:any) => {
            return true;
         }));
  }
  deleteRol(url:string):Observable<any> {
    return this._UtilitiesService.deleteQuery(url)
         .pipe(map( (res:any) => {
            return true;
         }));
  }


}

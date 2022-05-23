import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  server:string = environment.apiUrl;
 // private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(private Http:HttpClient,
              private _router:Router) { }

  //Funciones de sesion
  readToken(){
    if(this.validateToken()){
      let seccion = localStorage.getItem('token');
      return seccion
    }else{
      return ''
    }
  }
  validateToken():boolean{
    if(localStorage.getItem('token')){
      return true;
    }else{
      return false;
    }
  }
  getSession(param?:string){
    let data:string;
    if(param == ''){
      return data = localStorage.getItem('token');
    }else{
      return JSON.parse(localStorage.getItem('infoauth'))[param];
    }
  }

  //funciones de peticiones puras
  getQuery(query:string,sendHeaders:boolean){
    const URL = this.server + query;
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.readToken()}`
    });
    if(sendHeaders){
      return this.Http.get(URL, {headers}).pipe(catchError(this.handleError));     
    }
    else{
      return this.Http.get(URL).pipe(catchError(this.handleError)); 
    }
  }
  postQueryLogin(query:string, data:any,  typeHeaders:string='data'){
    const URL = this.server + query;
    let optiones:any;
    if(typeHeaders == 'data'){
      optiones = {
        'Authorization': ``,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
    }else{
      optiones = {
        'Authorization': ``,
        "Accept": "application/json"
      };
    }
    const headers = new HttpHeaders(optiones);
    headers.delete('Content-Type');
    return this.Http.post(URL, data, { headers }).pipe(catchError(this.handleError));    
  }
  postQuery(query:string, data:any,  typeHeaders:string='data'){
    const URL = this.server + query;
    let optiones:any;
    if(typeHeaders == 'data'){
      optiones = {
        'Authorization': `Bearer ${this.readToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
    }else{
      optiones = {
        'Authorization': `Bearer ${this.readToken()}`,
        "Accept": "application/json"
      };
    }
    const headers = new HttpHeaders(optiones);
    headers.delete('Content-Type');
    return this.Http.post(URL, data, { headers }).pipe(catchError(this.handleError));    
  }
  putQuery(query:string, data:any){
    const URL = this.server + query;
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.readToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return this.Http.put(URL, data, { headers }).pipe(catchError(this.handleError));     
  }

  deleteQuery(query:string){
    const URL = this.server + query;
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.readToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return this.Http.delete(URL, { headers }).pipe(catchError(this.handleError));     
  }

  //Funcion para el Manejo de errores
  handleError(err: HttpErrorResponse) {
    debugger;
    let errorMessage = 'Unknown error!';
    if (err.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${err.error.message}`;
    } else {
      // Server-side errors
      switch (err.status) {
        case 401:
          errorMessage = `Error Code: ${err.status}\nMessage: Token de sesion expiró`;
          localStorage.clear();
          //localStorage.removeItem(this.authLocalStorageToken);
          this._router.navigate(['/auth/login'], {
            queryParams: {},
          });
          //this._router.navigate(['/auth/login']);
          break;
        case 500:
          errorMessage = `Error Code: ${err.status}\nMessage: ${err.error}`;
            break;
        default:
          errorMessage = `Error Code: ${err.status}\nMessage: ${err.error}`;
          break;
      }
      
    }
    if(err.status != 401){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:  errorMessage
        })
       //window.alert(errorMessage);
      return throwError(errorMessage);
    }
    
  }

}

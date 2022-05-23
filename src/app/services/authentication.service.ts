import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UtilitiesService } from './utility.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {

  constructor(private Http:HttpClient,
    private _utility:UtilitiesService,
    private _router:Router) {
  }

  postSession(user:string,pass:string){
    let query:string = `authentication/login`;
    let data = {
      "username": user,
      "password": pass
    }
    return this._utility.postQueryLogin(query,data)
         .pipe(map( (res:any) => {
            this.saveSession(res);
            return true;
         }));
  }

  postCloseSession(){
    const apiURL = environment.apiUrl;
    
    const endpoint = `${ apiURL }Authentication/logout/${ this._utility.getSession('id') }`;
    const headers = new HttpHeaders({
    "Authorization": `Bearer ${this._utility.readToken()}`,
    "Accept": "application/json"
    });
    return this.Http.post(endpoint, { headers })
              .pipe(map( (data:string) => {
                return data = data;
              })); 
  }



  destroySession(){
    this.postCloseSession().subscribe((res:any) =>{
    localStorage.clear();
    this._router.navigate(['/auth/login']);
    })
  }

  saveSession(res){
    localStorage.setItem('token',res.token);
    localStorage.setItem('infoauth',JSON.stringify(res));
  }

}

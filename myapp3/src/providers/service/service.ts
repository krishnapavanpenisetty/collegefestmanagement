
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {

  constructor(public http: Http) {
    console.log('Hello ServiceProvider Provider');
  }
  addUser(body: Object): Observable<any> {
    let bodyString = JSON.stringify(body); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post('http://localhost:3000/users/register', body, options) // ...using post request
                     .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                     .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
}  
loginUser(body: Object): Observable<any> {
  let bodyString = JSON.stringify(body); // Stringify payload
  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  let options       = new RequestOptions({ headers: headers }); // Create a request option

  return this.http.post('http://localhost:3000/users/login', body, options) // ...using post request
                   .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                   .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
}  
getEvent (body: Object): Observable<any> {
  let bodyString = JSON.stringify(body); // Stringify payload
  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  let options       = new RequestOptions({ headers: headers }); // Create a request option

  return this.http.post('http://localhost:3000/eventscheck/event', body, options) // ...using post request
                   .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                   .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
}    
  
  
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HTTPService implements OnInit {

  constructor( private httpClient : HttpClient) { }

  ngOnInit(): void {
    console.log("Http Service");
  }

  doPost<T>(url: string, body: any, options : {headers : HttpHeaders}):Observable<T>{
    return this.httpClient.post<T>(url, body, options);
  }

  doGet<T>(url: string, options: {headers : HttpHeaders}) :Observable<T> {
    return  this.httpClient.get<T>(url, options);
  }
}

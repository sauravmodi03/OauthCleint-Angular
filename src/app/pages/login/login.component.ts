import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { loginapi } from 'src/app/apiconfig/endpoint';
import { HTTPService } from 'src/app/services/http.service';
import { Buffer } from 'buffer';
import { getToken, initSession, invalidateSession } from 'src/app/apiconfig/sessionService';
import { Router } from '@angular/router';
import { AuthResponse } from 'src/app/models/AuthResponse';
import { get } from 'http';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  });
  
  constructor(private httpService : HTTPService, private router:Router){
    console.log("Login Component");
    this.checkExistingSession();
  }

  ngOnInit(): void {
    console.log('Method not implemented.');
  }

  login() {
    console.log(this.loginForm.value);
    
    const credentials = `${this.loginForm.value.email}:${this.loginForm.value.password}`;

    const encodedCredentials = `Basic ${Buffer.from(credentials).toString('base64')}`;

    const options = {
      headers : new HttpHeaders({
        'Authorization': encodedCredentials,
        'Access-Control-Allow-Origin':'*'
      }),
      //responseType:'text/Plain'
    }

    this.httpService.doPost<AuthResponse>(loginapi, {}, options).subscribe((res:AuthResponse) => {
      if(res.message === 'Success' && res.accessToken != ''){
          initSession(this.loginForm.value.email!, res.accessToken);
          
          // setTimeout(()=>{
             this.router.navigate(["/"]);
          // },1000);
      }
    });

  }

  checkExistingSession(){
    const token = getToken();
    if(token){
      const decoded = jwtDecode(token);
      const exp = decoded.exp;
      if(exp! > Date.now()/1000){
        this.router.navigate(["/"]);
      }
      else{
        invalidateSession();
      }
    }


  }

  goToRegister(){
    this.router.navigate(["/register"]);
  }
  
}

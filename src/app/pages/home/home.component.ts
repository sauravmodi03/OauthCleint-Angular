import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken } from 'src/app/apiconfig/sessionService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  
  ngOnInit(): void {
    console.log('Home Component.');
  }

  constructor(private router:Router){
    this.validateSession();
  }
  

  validateSession(){

    const token = getToken();
    if(token){
      const decoded = jwtDecode(token);
      if(decoded?.exp && decoded.exp > Date.now()){
        this.navigateToLogin();
      }
      
    }else{
      this.navigateToLogin();
    }
    
  }

  logout(){
    removeToken();
    this.navigateToLogin();
  }

  navigateToLogin(){
    this.router.navigate(["/login"]);
  }

}

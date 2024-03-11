import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { signupapi } from 'src/app/apiconfig/endpoint';
import { AuthResponse } from 'src/app/models/AuthResponse';
import { User } from 'src/app/models/User';
import { HTTPService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  ngOnInit(): void {
    console.log('Method not implemented.');
  }

  constructor(private httpservice: HTTPService, private router:Router){

  }

  signupForm = new FormGroup({
    firstname: new FormControl(""),
    lastname: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),
    confirmpassword: new FormControl("")
  });


  signup(){
    const formData = this.signupForm.value;

    const userDto = new User(formData.firstname!, formData.lastname!, formData.email!, formData.password!);

    const options = {
      headers : new HttpHeaders({
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*'
        }),
    }
    const jsonobj = JSON.stringify(userDto);
    this.httpservice.doPost<AuthResponse>(signupapi, jsonobj, options).subscribe((response:AuthResponse) => {
      
      if(response.message === "Success"){
        alert("Account created successfully. Please check your email for account Verification.");
        this.router.navigate(["/login"]);
      }
      
    });

  }
}

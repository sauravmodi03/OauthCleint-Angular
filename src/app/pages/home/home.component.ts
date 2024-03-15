import { HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { addTodoApi, deleteTodoApi, getAllTodoApi } from 'src/app/apiconfig/endpoint';
import { getEmail, getToken, invalidateSession } from 'src/app/apiconfig/sessionService';
import { TTodo, TTodoResponse, TodoResponse } from 'src/app/models/Todo';
import { HTTPService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit{
  
  
  ngOnInit(): void {
    console.log('Home Component.');
  }

  showAddModal : boolean = false;

  constructor(private router:Router, private httpService:HTTPService){
    if(this.isTokenValid()) {
      this.loadTokenData()
      this.loadAllTodo()
    } else{
      this.navigateToLogin()
    }
  }

  isTokenValid(){
    const token = getToken()
    return token && jwtDecode(token).exp! > Date.now()/1000;
  }

  tokenExpired = getToken() == null;

  iat:number=Date.now()/1000;
  exp:number=Date.now()/1000;
  userEmail="";

  timer = Math.round(this.exp - Date.now()/1000);

  ngAfterViewInit(): void {
    setInterval(()=>{
      this.timer = Math.round(this.exp - Date.now()/1000);
      if(this.timer <= 0){
        this.tokenExpired = true;
      }
    },1000);
  }

  addTodoForm = new FormGroup({
    title:new FormControl(""),
    description:new FormControl("")
  });

  loadTokenData(){
    const token = getToken();
    if(token){
      const decoded = jwtDecode(token);
      this.iat = decoded.iat!;
      this.exp = decoded.exp!;
      this.userEmail = String(decoded.aud!);
    }
  }

  isTokenExpired(exp:number){
    return exp < Date.now()/1000;
  }

  validateSession(){
    if(this.tokenExpired){
      invalidateSession();
      this.navigateToLogin();
      return false;
    }
    return true;
  }

  logout(){
    invalidateSession();
    this.navigateToLogin();
  }

  navigateToLogin(){
    invalidateSession();
    this.router.navigate(["/login"]);
  }

  showAddTodoForm(){
    //this.validateSession();
    if(this.isTokenValid()) {
      this.showAddModal = true;
    } else{
      this.navigateToLogin();
    }
  }

  hideAddTodoForm(){
    this.showAddModal = false;
  }

  toggleTodo(){
    this.validateSession();
  }

  todoResponse = new TodoResponse();

  async addTodo(){
    //this.validateSession();
    if(this.isTokenValid()){
        const todo : TTodo = {
          id:0,
          email:getEmail()!,
          title:this.addTodoForm.value.title!,
          description:this.addTodoForm.value.description!,
          completed:false
        }

        this.httpService.doPost<TTodo>(addTodoApi, todo, this.getOptions(getToken()!)).subscribe((res:TTodo) =>{
          if(res!=null){
            this.loadAllTodo();
            this.showAddModal=false;
          }
        });
        setTimeout(()=>{},1000);
      } else{
        this.navigateToLogin();
      }
  }

  updateTodo(todo:TTodo){
    if(!this.isTokenValid()){
      this.navigateToLogin();
    }
  }

  deleteTodo(id:number){
    if(this.isTokenValid()) {
        this.httpService.doGet(deleteTodoApi(id), this.getOptions(getToken()!)).subscribe((res) => {
          console.log(res);
          this.loadAllTodo();
      })
    } else{
      this.navigateToLogin();
    }
  }


  loadAllTodo(){
    if(this.isTokenValid()){
      const token = getToken();
      if (token) {
        this.httpService.doGet<TTodoResponse>(getAllTodoApi+this.userEmail, this.getOptions(token!)).subscribe((res:TTodoResponse) => {
          //todos = res;
          this.todoResponse = res;
        })
      }
    }else{
      this.navigateToLogin();
    }
  }

  getOptions(token:string){
    const options = {
      headers : new HttpHeaders({
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',
        'Authorization':`Bearer ${token}`
        }), 
    }
    return options;
  }  

  todoPresent(){
    return this.todoResponse?.todos?.length > 0;
  }
  

}

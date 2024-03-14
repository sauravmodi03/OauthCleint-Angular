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
    this.loadTokenData();
    this.validateSession();
    this.loadAllTodo();
   // var todos : TTodoResponse;
  }

  tokenExpired = getToken() == null;

  iat:number=Date.now()/1000;
  exp:number=Date.now()/1000;

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
    }
    this.tokenExpired = this.isTokenExpired(this.exp);
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
    if(!this.validateSession()) return;
    
    this.showAddModal = true;
  }

  hideAddTodoForm(){
    this.showAddModal = false;
  }

  toggleTodo(){
    this.validateSession();
  }

  todoResponse = new TodoResponse();

  addTodo(){
    //this.validateSession();
    if(!this.validateSession()) return;
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
      console.log(res);
    })
  }

  updateTodo(todo:TTodo){
    this.validateSession();
  }

  deleteTodo(id:number){
    if(!this.validateSession()) return;
      this.httpService.doGet(deleteTodoApi(id), this.getOptions(getToken()!)).subscribe((res) => {
        console.log(res);
        this.loadAllTodo();
    })
  }


  loadAllTodo(){
    //var todos : TTodoResponse;
    if(!this.validateSession()) return;
    const token = getToken();
    if (token) {
      this.httpService.doGet<TTodoResponse>(getAllTodoApi, this.getOptions(token!)).subscribe((res:TTodoResponse) => {
        //console.log(res);
        //todos = res;
        this.todoResponse = res;
      })
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

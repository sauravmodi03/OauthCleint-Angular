import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit{
  
  
  ngOnInit(): void {
    console.log('Home Component.');
  }

  showAddModal : boolean = false;

  constructor(private router:Router, private httpService:HTTPService){
    this.validateSession();
    var todos : TTodoResponse;
  }

  addTodoForm = new FormGroup({
    title:new FormControl(""),
    description:new FormControl("")
  });
 
  

  validateSession(){

    const token = getToken();
    if(token){
      const decoded = jwtDecode(token);
      if(decoded?.exp && decoded.exp < Date.now()/1000){
        this.navigateToLogin();
      }else{
        this.getAllTodo();
      }
    }else{
      this.navigateToLogin();
    }
    
  }

  logout(){
    invalidateSession();
    this.navigateToLogin();
  }

  navigateToLogin(){
    this.router.navigate(["/login"]);
  }

  showAddTodoForm(){
    this.showAddModal = true;
  }

  hideAddTodoForm(){
    this.showAddModal = false;
  }

  toggleTodo(){

  }

  todoResponse = new TodoResponse();

  addTodo(){
    const todo : TTodo = {
      id:0,
      email:getEmail()!,
      title:this.addTodoForm.value.title!,
      description:this.addTodoForm.value.description!,
      completed:false
    }

    this.httpService.doPost<TTodo>(addTodoApi, todo, this.getOptions(getToken()!)).subscribe((res:TTodo) =>{
      if(res!=null){
        this.getAllTodo();
        this.showAddModal=false;
      }
      console.log(res);
    })
  }

  updateTodo(todo:TTodo){

  }

  deleteTodo(id:number){
    this.httpService.doGet(deleteTodoApi(id), this.getOptions(getToken()!)).subscribe((res) => {
        console.log(res);
    })
  }


  

  getAllTodo(){
    var todos : TTodoResponse;
    const token = getToken();
    this.httpService.doGet<TTodoResponse>(getAllTodoApi, this.getOptions(token!)).subscribe((res:TTodoResponse) => {
      console.log(res);
      todos = res;
      this.todoResponse = res;
    })
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

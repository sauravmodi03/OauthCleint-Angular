import { getEmail } from "./sessionService";

const host = "https://localhost:7012";
const loginendpoint = "/api/Login/basic";
const singupendpoint = "/api/Register/user";

const loginapi = `${host}${loginendpoint}`;

const signupapi = `${host}${singupendpoint}`;


const resourceHost = "https://localhost:7273";
const addTodo = "/api/Resource/add/todo";
const updateTodo = "/api/Resource/update/todo";
const deleteTodo = "/api/Resource/delete/todo";
const getAllTodos = "/api/Resource/get/todos";

const addTodoApi = `${resourceHost}${addTodo}`;
const updateTodoApi = `${resourceHost}${updateTodo}`;
const deleteTodoApi =  (id:number) => `${resourceHost}${deleteTodo}?id=${id}`;
const getAllTodoApi = `${resourceHost}${getAllTodos}?email=${getEmail()}`;


export {loginapi, signupapi, addTodoApi, updateTodoApi, deleteTodoApi, getAllTodoApi};
export type TTodoResponse = {
    email:string;
    todos: TTodo[];
}


export type TTodo = {
    id:number;
    email:string;
    title:string;
    description:string;
    completed:boolean;
}

export class TodoResponse implements TTodoResponse {
    email!: string;
    todos!: TTodo[];
    
}
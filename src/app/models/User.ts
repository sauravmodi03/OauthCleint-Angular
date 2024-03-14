export class User {
    public firstName:string;
    public lastName:string;
    public email:string;
    public password:string;

    constructor(fname:string, lname:string, email:string, password:string){
        this.firstName = fname;
        this.lastName = lname;
        this.email = email;
        this.password = password;
    }

    
}
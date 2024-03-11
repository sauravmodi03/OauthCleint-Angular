export class AuthResponse {
    public email:string;
    public accessToken:string;
    public message:string;

    constructor(email:string, accessToken:string, message:string){
        this.email = email;
        this.accessToken = accessToken;
        this.message = message;
    }
}
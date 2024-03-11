export interface ILogin {
    email:string;
    password:string;
}

export class Login {
    public email:string;
    public password:string;

    constructor(config: ILogin){
        this.email = config.email;
        this.password = config.password;
    }
}


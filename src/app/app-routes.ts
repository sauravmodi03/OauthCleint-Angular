import { Route, Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { HomeComponent } from "./pages/home/home.component";


const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'login', component:LoginComponent, pathMatch:'full'},
    {path:'register', component:RegisterComponent, pathMatch:'full'},
    {path:'home', component:HomeComponent, pathMatch:'full'},
];

export default routes;
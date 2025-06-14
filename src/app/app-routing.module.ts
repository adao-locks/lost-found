import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { ItemFoundComponent } from './component/item-found/item-found.component';
import { ClaimsComponent } from './component/claims/claims.component';
import { HistoricComponent } from './component/historic/historic.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'found-items', component: ItemFoundComponent },
  { path: 'claims', component: ClaimsComponent },
  { path: 'history', component: HistoricComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

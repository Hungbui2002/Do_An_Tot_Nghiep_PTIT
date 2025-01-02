import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { DishPageComponent } from './components/pages/dish-page/dish-page.component';
import { CategoriesPageComponent } from './components/pages/categories-page/categories-page.component';
import { IntroductionComponent } from './components/partials/introduction/introduction.component';
import { ContactComponent } from './components/partials/contact/contact.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { adminGuard } from './components/auth/guard/admin.guard';
import { authGuard } from './components/auth/guard/auth.guard';
import { PaymentHistoryComponent } from './components/pages/payment-history/payment-history.component';
import { DishPaidComponent } from './components/pages/dish-paid/dish-paid.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dish/:dishId', component: DishPageComponent },
  { path: 'category/:categoryId', component: CategoriesPageComponent },
  { path: 'dish-paid', component: DishPaidComponent, canActivate: [authGuard] },

  // Admin routes
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [adminGuard],
  },

  //Auth routes
  {
    path: 'auth',
    loadChildren: () =>
      import('./components/auth/auth.module').then((m) => m.AuthModule),
  },

  //footer route
  { path: 'introduction', component: IntroductionComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'not-found', component: NotFoundComponent },

  { path: 'payment-history', component: PaymentHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

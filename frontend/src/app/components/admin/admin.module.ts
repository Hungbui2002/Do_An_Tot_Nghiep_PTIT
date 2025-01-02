import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDishComponent } from './dishes/add-dish/add-dish.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { DishesComponent } from './dishes/dishes.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDialogComponent } from './categories/category-dialog/category-dialog.component';
import { IngredientsDialogComponent } from './ingredients/ingredients-dialog/ingredients-dialog.component';
import { EditDishComponent } from './dishes/edit-dish/edit-dish.component';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environments';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingInterceptor } from 'src/app/share/interceptors/loading.interceptor';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: 'dish', component: DishesComponent },
  { path: 'add-dish', component: AddDishComponent },
  { path: 'edit-dish/:dishId', component: EditDishComponent },
  { path: 'category', component: CategoriesComponent },
  { path: 'ingredient', component: IngredientsComponent },
  { path: 'user', component: UserComponent },
  { path: 'payment', component: PaymentComponent },
];

@NgModule({
  declarations: [
    AddDishComponent,
    MenuAdminComponent,
    DishesComponent,
    IngredientsComponent,
    CategoriesComponent,
    CategoryDialogComponent,
    IngredientsDialogComponent,
    EditDishComponent,
    UserComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToastModule,
    MessagesModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    MessageService,
  ],
})
export class AdminModule {}

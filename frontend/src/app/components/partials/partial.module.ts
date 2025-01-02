import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingInterceptor } from 'src/app/share/interceptors/loading.interceptor';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CategoriesListComponent } from './categories-list/categories.component';
import { SearchComponent } from './search/search.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { LoadingComponent } from './loading/loading.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { ContactComponent } from './contact/contact.component';
import { DishCardComponent } from './dish-card/dish-card.component';
import { VndCurrencyPipePipe } from './pipes/vnd-currency-pipe.pipe';
import { ConfirmDialogComponent } from './dish-card/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CategoriesListComponent,
    SearchComponent,
    StarRatingComponent,
    LoadingComponent,
    IntroductionComponent,
    ContactComponent,
    DishCardComponent,
    VndCurrencyPipePipe,
    ConfirmDialogComponent,
  ],
  // Xuất các component cần sử dụng ở module khác
  exports: [
    HeaderComponent,
    FooterComponent,
    CategoriesListComponent,
    SearchComponent,
    StarRatingComponent,
    LoadingComponent,
    DishCardComponent,
    VndCurrencyPipePipe,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
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
export class PartialModule {}

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PrinciplesRoutes } from './principles-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { EditPrincipleComponent } from './edit-principle/edit-principle1.component';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  declarations: [
    EditPrincipleComponent,
    // ListPrinciplesComponent,
    // Principle1Component,
    // Principle2Component,
    // Principle3Component,
    // Principle4Component,
    // Principle5Component,
    // Principle6Component,
    // Principle7Component,
    // DialogPrinciple1Component,
    // DialogPrinciple2Component,
    // DialogPrinciple3Component,
    // DialogPrinciple4Component,
    // DialogPrinciple5Component,
    // DialogPrinciple6Component,
    // DialogPrinciple7Component,
    // GraphicsComponent,
    // GraphicsBComponent,
    // GraphicsCComponent,
  ],
  imports: [
    CommonModule,
  
    RouterModule.forChild(PrinciplesRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    TablerIconsModule.pick(TablerIcons),
    HttpClientModule,
    MatNativeDateModule,
    MatNativeDateModule,
    TranslateModule,
    NgApexchartsModule 
  ],
  providers: [DatePipe],
})
export class PrinciplesModule { }

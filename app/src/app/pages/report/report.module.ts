import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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
import { ReportRoutes} from './report-routing.module';
import {  DialogListReport,  ReportListComponent } from './report-list/report-list.component';
import { ListPrinciplesComponent } from './list-principles/list-principles.component';
import { DialogPrinciple1Component, Principle1Component } from './principle1/principle1.component';
import { DialogPrinciple2Component, Principle2Component } from './principle2/principle2.component';
import { DialogPrinciple3Component, Principle3Component } from './principle3/principle3.component';
import { DialogPrinciple4Component, Principle4Component } from './principle4/principle4.component';
import { DialogPrinciple5Component, Principle5Component } from './principle5/principle5.component';
import { DialogPrinciple6Component, Principle6Component } from './principle6/principle6.component';
import { DialogPrinciple7Component, Principle7Component } from './principle7/principle7.component';
import { GraphicsComponent } from './graphics/graphics.component';
import { GraphicsBComponent } from './graphics-b/graphics-b.component';
import { GraphicsCComponent } from './graphics-c/graphics-c.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ShareDataService } from '@app/services/share-data.service';
import { ReportHistoryComponent } from './report-history/report-history.component';


@NgModule({
  declarations: [
    ReportListComponent,
    DialogListReport,
    ListPrinciplesComponent,
    Principle1Component,
    Principle2Component,
    Principle3Component,
    Principle4Component,
    Principle5Component,
    Principle6Component,
    Principle7Component,
    DialogPrinciple1Component,
    DialogPrinciple2Component,
    DialogPrinciple3Component,
    DialogPrinciple4Component,
    DialogPrinciple5Component,
    DialogPrinciple6Component,
    DialogPrinciple7Component,
    GraphicsComponent,
    GraphicsBComponent,
    GraphicsCComponent,
    ReportHistoryComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportRoutes),
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
  providers: [DatePipe, ShareDataService],
})
export class ReportModule { }

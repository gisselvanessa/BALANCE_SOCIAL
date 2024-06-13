import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutes } from './admin.routing.module';
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { MatNativeDateModule } from '@angular/material/core';

import { GeographyComponent } from './geography/geography.component';
import { AppGeographyDialogContentComponent } from './geography/geography.component';

import { CreateCorporationComponent } from './corporation/create-corporation/create-corporation.component';
import { EditCorporationComponent } from './corporation/edit-corporation/edit-corporation.component';
import { ViewCorporationComponent } from './corporation/view-corporation/view-corporation.component';
import { DialogListCorporationComponent, ListCorporationComponent } from './corporation/list-corporation/list-corporation.component';
import { DialogListBranchComponent, ListBranchComponent } from './branch/list-branch/list-branch.component';
import { CreateBranchComponent } from './branch/create-branch/create-branch.component';
import { EditBranchComponent } from './branch/edit-branch/edit-branch.component';
import { ViewBranchComponent } from './branch/view-branch/view-branch.component';
import { DialogListDepartmentComponent, ListDeparmentComponent } from './department/list-deparment/list-deparment.component';
import { ViewDepartmentComponent } from './department/view-department/view-department.component';
import { EditDepartmentComponent } from './department/edit-department/edit-department.component';
import { CreateDepartmentComponent } from './department/create-department/create-department.component';
import { CreateRoleComponent } from './roles/create-role/create-role.component';
import { DialogListRoleComponent, ListRoleComponent } from './roles/list-role/list-role.component';
import { EditRoleComponent } from './roles/edit-role/edit-role.component';
import { CreatePersonComponent } from './persons/create-person/create-person.component';
import { EditPersonComponent } from './persons/edit-person/edit-person.component';
import { DialogListPersonComponent, ListPersonComponent } from './persons/list-person/list-person.component';
import { ViewPersonComponent } from './persons/view-person/view-person.component';
import { ViewRoleComponent } from './roles/view-role/view-role.component';
import { AppGenderDialogContentComponent, GenderComponent } from './gender/gender.component';


@NgModule({
  declarations: [
    GeographyComponent,
    AppGeographyDialogContentComponent,
    CreateCorporationComponent,
    EditCorporationComponent,
    ViewCorporationComponent,
    ListCorporationComponent,
    DialogListCorporationComponent,
    ListBranchComponent,
    CreateBranchComponent,
    EditBranchComponent,
    ViewBranchComponent,
    DialogListBranchComponent,
    ListDeparmentComponent,
    ViewDepartmentComponent,
    EditDepartmentComponent,
    CreateDepartmentComponent,
    DialogListDepartmentComponent,
    CreateRoleComponent,
    ListRoleComponent,
    DialogListRoleComponent,
    EditRoleComponent,
    CreatePersonComponent,
    EditPersonComponent,
    ListPersonComponent,
    ViewPersonComponent,
    DialogListPersonComponent,
    ViewRoleComponent,
    GenderComponent,
    AppGenderDialogContentComponent
    

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
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
    TranslateModule
  ],
  providers: [DatePipe],
})
export class AdminModule {}

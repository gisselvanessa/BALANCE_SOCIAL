import { Routes, RouterModule } from '@angular/router';
import { GeographyComponent } from './geography/geography.component';
import { CreateCorporationComponent } from './corporation/create-corporation/create-corporation.component';
import { ViewCorporationComponent } from './corporation/view-corporation/view-corporation.component';
import { EditCorporationComponent } from './corporation/edit-corporation/edit-corporation.component';
import { ListCorporationComponent } from './corporation/list-corporation/list-corporation.component';
import { NgModule } from '@angular/core';
import { ListBranchComponent } from './branch/list-branch/list-branch.component';
import { ViewBranchComponent } from './branch/view-branch/view-branch.component';
import { CreateBranchComponent } from './branch/create-branch/create-branch.component';
import { EditBranchComponent } from './branch/edit-branch/edit-branch.component';
import { ListDeparmentComponent } from './department/list-deparment/list-deparment.component';
import { ViewDepartmentComponent } from './department/view-department/view-department.component';
import { CreateDepartmentComponent } from './department/create-department/create-department.component';
import { EditDepartmentComponent } from './department/edit-department/edit-department.component';
import { CreateRoleComponent } from './roles/create-role/create-role.component';
import { ListRoleComponent } from './roles/list-role/list-role.component';
import { EditRoleComponent } from './roles/edit-role/edit-role.component';
import { ListPersonComponent } from './persons/list-person/list-person.component';
import { ViewPersonComponent } from './persons/view-person/view-person.component';
import { CreatePersonComponent } from './persons/create-person/create-person.component';
import { EditPersonComponent } from './persons/edit-person/edit-person.component';
import { ViewRoleComponent } from './roles/view-role/view-role.component';
import { GenderComponent } from './gender/gender.component';

export const AdminRoutes: Routes = [
  {
    path: 'geography',
    component: GeographyComponent,
    data: {
      title: 'Geography',
    },   
  },
  {
    path: 'gender',
    component: GenderComponent,
    data: {
      title: 'Gender',
    },   
  },
  {
    path: 'role',
    component: ListRoleComponent,
    data: {
      title: 'Roles and Privileges',
    },   
  },
  {
    path: 'role-create',
    component: CreateRoleComponent,
    data: {
      title: 'Role Create',
    },   
  },
  {
    path: 'role-edit/:id',
    component: EditRoleComponent,
    data: {
      title: 'Role Edit',
    },   
  },
  {
    path: 'role-view/:id',
    component: ViewRoleComponent,
    data: {
      title: 'Role View',
    },
  },
  {
    path: 'corporation',
    component: ListCorporationComponent,
    data: {
      title: 'Corporation',
    },
   
  },
  {
    path: 'corporation-view/:id',
    component: ViewCorporationComponent,
    data: {
      title: 'Corporation View',
    },
  },
  {
    path: 'corporation-create',
    component: CreateCorporationComponent,
    data: {
      title: 'Corporation Create',
    },
  },
  {
    path: 'corporation-edit/:id',
    component: EditCorporationComponent,
    data: {
      title: 'Corporation Edit',
    },
  },

  {
    path: 'branch',
    component: ListBranchComponent,
    data: {
      title: 'Branch',
    },
   
  },
  {
    path: 'branch-view/:id',
    component: ViewBranchComponent,
    data: {
      title: 'Branch View',
    },
  },
  {
    path: 'branch-create',
    component: CreateBranchComponent,
    data: {
      title: 'Branch Create',
    },
  },
  {
    path: 'branch-edit/:id',
    component: EditBranchComponent,
    data: {
      title: 'Branch Edit',
    },
  },
  {
    path: 'department',
    component: ListDeparmentComponent,
    data: {
      title: 'Department',
    },
   
  },
  {
    path: 'department-view/:id',
    component: ViewDepartmentComponent,
    data: {
      title: 'Department View',
    },
  },
  {
    path: 'department-create',
    component: CreateDepartmentComponent,
    data: {
      title: 'Department Create',
    },
  },
  {
    path: 'department-edit/:id',
    component: EditDepartmentComponent,
    data: {
      title: 'Department Edit',
    },
  },

  {
    path: 'person',
    component: ListPersonComponent,
    data: {
      title: 'Person',
    },
   
  },
  {
    path: 'person-view/:id',
    component: ViewPersonComponent,
    data: {
      title: 'Person View',
    },
  },
  {
    path: 'person-create',
    component: CreatePersonComponent,
    data: {
      title: 'Person Create',
    },
  },
  {
    path: 'person-edit/:id',
    component: EditPersonComponent,
    data: {
      title: 'Person Edit',
    },
  },
  
];



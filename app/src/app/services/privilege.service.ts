import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { ResponseModel } from '@app/models/response';

@Injectable({ providedIn: 'root' })
export class PrivilegeService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  grantRole(idPrivilege:string) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/user/updatePrivileges/${idPrivilege}/`,  {status: true} )
    .pipe(map(response => {
      return response;
    }));
  }

  // denyRole(idPrivilege: string) {
    denyRole(idPrivilege:string) {

    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deletePrivileges/${idPrivilege}/`)
    // return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deletePrivileges/${idPrivilege}/`)

    .pipe(map(response => {
      return response;
    }));
  }

  getGrantByIdRole() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/privilege/getGrantByIdRole`)
    .pipe(map(response => {
      return response;
    }));
  }

  getPrivilegeByIdRole(idRole: string) {
    return this.http.get<any>(`${environment.apiUrl}/user/privilegesByRoles/?idrol=${idRole}`)
    .pipe(map(response => {
      return response;
    }));
  }
  getAllPrivileges() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allPrivileges/`)
    .pipe(map(response => {
      return response;
    }));
  }
  
}

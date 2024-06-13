import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { RoleModel } from '@app/models/role';
import { ResponseModel } from '@app/models/response';

@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  create(bodyRequest: RoleModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createRoles/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: RoleModel) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/user/updateRoles/${bodyRequest.idrol}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteRoles/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }

  getAllData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allRoles/`)
    .pipe(map(response => {
      return response;
    }));
  }

  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeRoles/`)
    .pipe(map(response => {
      return response;
    }));
  }

  getDataById(id: string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/idRoles/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }

  getDataByIdDepartment(id: string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/rolesByDepartments/?iddepartamento=${id}`)
    .pipe(map(response => {
      return response;
    }));
  }
}

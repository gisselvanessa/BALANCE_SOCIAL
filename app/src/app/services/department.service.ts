import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DepartmentModel } from './../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private http: HttpClient

  ) { }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allDepartments/?page=${page}&search_string=${searchValue}&page_size=${pageSize}`)
    .pipe(map(response => {
      return response;
    }));
  }

  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeDepartments/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: DepartmentModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createDepartments/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: DepartmentModel) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/user/updateDepartments/${bodyRequest.iddepartamento}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteDepartments/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  //noo
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/user/idDepartments/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataByIdBranch(id: string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/departmentsByBranches/?idsucursal=${id}`)
    .pipe(map(response => {
      return response;
    }));
  }
}

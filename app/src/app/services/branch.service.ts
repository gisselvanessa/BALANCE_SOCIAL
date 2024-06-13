import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BranchModel } from './../models/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private http: HttpClient

  ) { }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allBranches/?page=${page}&search_string=${searchValue}&page_size=${pageSize}`)
    .pipe(map(response => {
      return response;
    }));
  }

  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeBranches/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: BranchModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createBranches/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: BranchModel) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/user/updateBranches/${bodyRequest.idsucursal}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteBranches/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/user/idBranches/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataByIdCorporation(id: string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/branchesByCorporations/?idcorporacion=${id}`)
    .pipe(map(response => {
      return response;
    }));
  }
}

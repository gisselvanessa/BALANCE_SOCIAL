import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectiveModel } from '@app/models/objective';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {

  constructor(
    private http: HttpClient
  ) { }
  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/principles/allIndicators/?page=${page}&search_string=${searchValue}`)
    .pipe(map(response => {
      return response;
    }));
  }
  
  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/Objectives/activeCorporations/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: ObjectiveModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/principles/api/Objectives/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: ObjectiveModel) {
    return this.http.patch<ResponseModel>(`${environment.apiUrl}/principles/api/Objectives/${bodyRequest.idobjectivo}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/Objectives/deleteCorporation/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/principles/indicatorsByPrinciples/?idprincipio=${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
}

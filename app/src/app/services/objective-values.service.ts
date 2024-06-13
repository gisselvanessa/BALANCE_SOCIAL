import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectiveValueModel } from '@app/models/objectiveValues';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveValuesService {

  constructor(
    private http: HttpClient

  ) { }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/principles/allObjetivosValores/?page=${page}&search_string=${searchValue}`)
    .pipe(map(response => {
      return response;
    }));
  }
  
  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/Objectives/activeObjetivosValores/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: ObjectiveValueModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/principles/api/ObjetivosValores/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: ObjectiveValueModel) {
    return this.http.patch<ResponseModel>(`${environment.apiUrl}/principles/api/ObjetivosValores/${bodyRequest.idobjetivevalue}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/Objectives/deleteObjetivosValores/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/principles/indicatorsByPrinciples/?idprincipio=${id}`)
    .pipe(map(response => {
      return response;
    }));
  }
}

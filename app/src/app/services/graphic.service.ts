import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphicModel } from '@app/models/graphic';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphicService {

  constructor(
    private http: HttpClient

  ) { }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/principles/allObjectivesValues/`)
    .pipe(map(response => {
      return response;
    }));
  }
  
  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeObjectivesValues/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: GraphicModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/principles/api/ObjetivosValores/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: GraphicModel) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/principles/api/ObjetivosValores/${bodyRequest.idprincipio}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteObjectivesValues/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/principles/idObjectivesValues/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
}

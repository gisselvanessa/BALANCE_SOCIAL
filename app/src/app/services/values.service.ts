import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '@app/models/response';
import { ValuesModel } from '@app/models/values';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValuesService {

  constructor(
    private http: HttpClient
  ) { }
  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/principles/allPrinciples/`)
    .pipe(map(response => {
      return response;
    }));
  }
  
  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeCorporations/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: ValuesModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/principles/api/Values/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: ValuesModel) {
    return this.http.patch<ResponseModel>(`${environment.apiUrl}/principles/api/Values/${bodyRequest.idvalores}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteCorporation/${id}`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/principles/idPrinciples/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
}

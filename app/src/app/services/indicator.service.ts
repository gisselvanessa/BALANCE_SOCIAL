import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IndicatorModel } from '@app/models/indicators';
import { PrincipleModel } from '@app/models/principle';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  constructor(
    private http: HttpClient
  ) { 
    
  }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/principles/allIndicators/?page=${page}&search_string=${searchValue}`)
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

  create(bodyRequest: IndicatorModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createCorporations/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: IndicatorModel) {
    // return this.http.put<ResponseModel>(`${environment.apiUrl}/user/updateCorporation/${bodyRequest.idcorporacion}/`, bodyRequest)
    // .pipe(map(response => {
    //   return response;
    // }));
  }

  delete(id: string) {
    // return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteCorporation/${id}`)
    // .pipe(map(response => {
    //   return response;
    // }));
  }
  getDataById(id: string, searchValue:string) {
    return this.http.get(`${environment.apiUrl}/principles/indicatorsByPrinciples/?idprincipio=${id}&search_string=${searchValue}`)
    .pipe(map(response => {
      return response;
    }));
  }
}

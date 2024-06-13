import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { GenderModel } from '@app/models/gender';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  constructor(
    private http: HttpClient

  ) { }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allGenders/?page=${page}&search_string=${searchValue}&page_size=${pageSize}`)
    .pipe(map(response => {
      return response;
    }));
  }

  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeGenders/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: GenderModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createGenders/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: GenderModel) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/user/updateGenders/${bodyRequest.idgenero}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteGenders/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/user/idGenders/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataByIdCorporation(id: string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/branch/getByIdCorporation/${id}`)
    .pipe(map(response => {
      return response;
    }));
  }
}

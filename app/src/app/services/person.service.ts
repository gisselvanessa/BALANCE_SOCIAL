import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PersonModel } from './../models/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(
    private http: HttpClient

  ) { }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allUsers/?page=${page}&search_string=${searchValue}&page_size=${pageSize}`)
    .pipe(map(response => {
      return response;
    }));
  }

  // getAllData() {
  //   return this.http.get<ResponseModel>(`${environment.apiUrl}/users/createUser/`)
  //   .pipe(map(response => {
  //     return response;
  //   }));
  // }

  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeUsers/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: PersonModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createUsers/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: PersonModel) {
    return this.http.patch<ResponseModel>(`${environment.apiUrl}/user/updateUsers/${bodyRequest.idusuario}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteUsers/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/user/idUsers/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
}

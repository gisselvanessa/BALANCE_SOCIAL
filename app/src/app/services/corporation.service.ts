import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CorporationModel } from '@app/models/corporation';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CorporationService {

  constructor(
    private http: HttpClient
  ) { }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allCorporations/?page=${page}&search_string=${searchValue}&page_size=${pageSize}`)
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

  create(bodyRequest: CorporationModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createCorporations/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: CorporationModel) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/user/updateCorporation/${bodyRequest.idcorporacion}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteCorporation/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/user/idCorporation/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrincipleModel } from '@app/models/principle';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrinciplesService {

  constructor(
    private http: HttpClient
  ) { }
  getAllData(page: number, pageSize:number, searchValue:string, idreport:number) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/reports/principlesByReports/?idreporte=${idreport}`)
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

  create(bodyRequest: PrincipleModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createCorporations/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: PrincipleModel) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/principles/api/Principles/${bodyRequest.idprincipio}/`, bodyRequest)
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
    return this.http.get(`${environment.apiUrl}/principles/idPrinciples/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
}

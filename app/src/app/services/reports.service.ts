import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '@app/models/response';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient
  ) { }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/reports/allReports/?page=${page}&search_string=${searchValue}`)
    .pipe(map(response => {
      return response;
    }));
  }
  
  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/reports/activeReports/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: any) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/reports/api/Reports/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: any) {
    return this.http.patch<ResponseModel>(`${environment.apiUrl}/reports/api/Reports/${bodyRequest.idreporte}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/reports/api/Reports/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }
  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/reports/indicatorsByPrinciples/?idprincipio=${id}`)
    .pipe(map(response => {
      return response;
    }));
  }

  getDataByIdUser(id: string) {
    return this.http.get(`${environment.apiUrl}/reports/reportsByUsers/?iduser=${id}`)
    .pipe(map(response => {
      return response;
    }));
  }
  // async openDocument(data: any): Promise<void> {
  //   const idArchivo = data.idreporte;
  //   try {
  //     // Realizar una solicitud HTTP para verificar si la petición se completa correctamente.
  //     const response: any = await this.http.get(`${environment.apiUrl}/reports/generateDocx/?idreporte=${idArchivo}`).toPromise();
      
  //     // Si la respuesta indica éxito, redirigir al usuario a la ubicación del documento.
  //     if (response) {
  //       window.location.href = `${environment.apiUrl}/reports/generateDocx/?idreporte=${idArchivo}`;
  //     } else {
  //       console.log('error');
  //       throw new Error('Error al generar el documento');
  //     }
  //   } catch (error:any) {
  //     // Manejar cualquier error que ocurra durante la verificación o la redirección.
  //     console.error('Error al abrir el documento:', error);
  //     throw new Error('Error al abrir el documento: ' + error.message);
  //   }
  // }
  
  async openDocument(data: any) {
    const idArchivo = data.idreporte;
    window.location.href = `${environment.apiUrl}/reports/generateDocx/?idreporte=${idArchivo}`;
  }
}

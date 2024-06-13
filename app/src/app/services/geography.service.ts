import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, startWith, toArray } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { ResponseModel } from '@app/models/response';
import { GeographyModel } from '@app/models/geography';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeographyService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllData(page: number, pageSize:number, searchValue:string) {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allGeography/?page=${page}&search_string=${searchValue}&page_size=${pageSize}`)
    .pipe(map(response => {
      return response;
    }));
  }

  getData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/activeGeography/`)
    .pipe(map(response => {
      return response;
    }));
  }

  create(bodyRequest: GeographyModel) {
    return this.http.post<ResponseModel>(`${environment.apiUrl}/user/createGeography/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  update(bodyRequest: GeographyModel) {
    return this.http.put<ResponseModel>(`${environment.apiUrl}/user/updateGeography/${bodyRequest.idgeografia}/`, bodyRequest)
    .pipe(map(response => {
      return response;
    }));
  }

  delete(id: string) {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/user/deleteGeography/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }

  getDataById(id: string) {
    return this.http.get(`${environment.apiUrl}/user/idGeography/${id}/`)
    .pipe(map(response => {
      return response;
    }));
  }

  getAllPages(): Observable<any[]> {
    // Número de página inicial
    let currentPage = 1;

    // Función recursiva para obtener todas las páginas
    const getAllPagesRecursive = (): Observable<any[]> => {
      return this.http.get<any[]>(`${environment.apiUrl}/user/allGeography/?page=${currentPage}&search_string=`).pipe(
        concatMap((result) => {
          if (result.length > 0) {
            // Si hay resultados en la página actual, incrementar la página y realizar otra solicitud
            currentPage++;
            return getAllPagesRecursive().pipe(startWith(result));
          } else {
            // Si no hay más resultados, retornar un observable vacío para finalizar la recursión
            return of([]);
          }
        })
      );
    };

    // Iniciar la llamada recursiva y combinar todos los resultados
    return getAllPagesRecursive().pipe(
      toArray(), // Convertir los resultados en un solo array
      concatMap((pages) => pages) // Concatenar todos los arrays de resultados
    );
  }
}

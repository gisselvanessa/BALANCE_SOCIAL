import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { ResponseModel } from '@app/models/response';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  getAllData() {
    return this.http.get<ResponseModel>(`${environment.apiUrl}/user/allPages/`)
    .pipe(map(response => {
      return response;
    }));
  }
}

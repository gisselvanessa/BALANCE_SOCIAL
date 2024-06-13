import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MessagesPopups } from "@app/helpers/messagesPopups";

import { LoginService } from '@app/services/login.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private messagesPopups: MessagesPopups,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.loginService.userValue;

    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].includes(err.status) && this.loginService.userValue) {
        // auto logout if 401 or 403 response returned from api
        // this.loginService.logout();
        // console.log('TOKEN EXPIRADO');
        
        // this.messagesPopups.popupMessage('Token Expirado');

        // Token de acceso expirado, intentar renovar usando refreshToken
        const refreshToken = user?.refresh;
        console.log('refreshToken');

        if (refreshToken) {
     
            return this.loginService.refreshToken({ refresh: refreshToken }).pipe(
                switchMap((response: any) => {
                    const newToken = response?.access;  // Utiliza la respuesta del servidor
                    if (newToken) {
                        request = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                    }
                    return next.handle(request);
                }),
                catchError((error: any) => {
                  // Manejar errores durante la renovación del token
                  console.error('Error renovando token:', error);
                  // Puedes decidir si quieres redirigir al usuario o manejar de otra manera
                  this.loginService.logout();
                  return EMPTY;
              })
            );
        } else {
        this.messagesPopups.popupMessage('Token Expirado');

            // Si no hay refreshToken, redirigir al usuario al inicio de sesión
            this.loginService.logout();
            return EMPTY;
        }
      }

      const error = err.error?.message || err.statusText;
      return throwError(() => error);
    }))
  }
}
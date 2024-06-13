import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, catchError, switchMap } from 'rxjs';

import { environment } from '@environments/environment';
import { LoginService } from '@app/services/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.loginService.userValue;
        const isLoggedIn = user?.access;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${user.access}` }
            });
        }

        return next.handle(request);
    }

    // // JwtInterceptor con manejo de refreshToken
    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     const user = this.loginService.userValue;
    //     const isLoggedIn = user?.access;
    //     const isApiUrl = request.url.startsWith(environment.apiUrl);
    
    //     if (isLoggedIn && isApiUrl) {
    //         const token = user.access;
    //         console.log(user);
            
    //         request = this.addToken(request, token);
    //     }
    
    //     return next.handle(request).pipe(
    //         catchError(error => {
    //             if (error instanceof HttpErrorResponse && error.status === 401) {
    //                 // Token de acceso expirado, intentar renovar usando refreshToken
    //                 const refreshToken = user?.refresh;
    //                 console.log(refreshToken);
    
    //                 if (refreshToken) {
    //                     // Enviar una solicitud para renovar el token usando el refreshToken
    //                     // (deberías implementar la lógica para obtener un nuevo token de acceso)
    //                     // Luego, actualiza el Local Storage con el nuevo token de acceso.
    
    //                     // Ejemplo:
    //                     return this.loginService.refreshToken(refreshToken).pipe(
    //                         switchMap((response: any) => {
    //                             const newToken = response?.access;  // Utiliza la respuesta del servidor
    //                             if (newToken) {
    //                                 request = request.clone({
    //                                     setHeaders: {
    //                                         Authorization: `Bearer ${newToken}`
    //                                     }
    //                                 });
    //                             }
    //                             return next.handle(request);
    //                         })
    //                     );
    //                 } else {
    //                     // Si no hay refreshToken, redirigir al usuario al inicio de sesión
    //                     this.loginService.logout();
    //                     return EMPTY;
    //                 }
    //             }
    //             throw error;
    //         })
    //     );
    // }
    
    // private addToken(request: HttpRequest<any>, token: string | undefined): HttpRequest<any> {
    //     return request.clone({
    //         setHeaders: { Authorization: `Bearer ${token}` }
    //     });
    // }
    
}
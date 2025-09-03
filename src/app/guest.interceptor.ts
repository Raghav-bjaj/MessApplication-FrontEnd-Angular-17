
import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

// Helper function to recursively find and mask 'reg' properties
function maskRegistrationNumbers(body: any): any {
  if (!body) { return body; }

  if (Array.isArray(body)) {
    return body.map(item => maskRegistrationNumbers(item));
  }

  if (typeof body === 'object' && body !== null) {
    const newBody = { ...body };
    for (const key in newBody) {
      if (key === 'reg' && typeof newBody[key] === 'string' && newBody[key].length > 5) {
        const value = newBody[key];
        const firstPart = value.substring(0, 3);
        const lastPart = value.substring(value.length - 2);
        newBody[key] = `${firstPart}*****${lastPart}`;
      } else {
        newBody[key] = maskRegistrationNumbers(newBody[key]);
      }
    }
    return newBody;
  }
  return body;
}

export const guestInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);

  return authService.isGuest$.pipe(
    take(1),
    switchMap(isGuest => {
      // If the user is not a guest, let the request pass through unmodified.
      if (!isGuest) {
        return next(req);
      }

      // --- IF USER IS A GUEST ---

      // 1. Block all "write" operations (POST, PUT, DELETE)
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        snackBar.open('You are a guest and not authorised for this action.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        // Block the request by returning an empty observable or an error
        return of(new HttpResponse({ status: 403, statusText: 'Forbidden' }));
      }

      // 2. For "read" operations (GET), intercept the RESPONSE to mask data
      return next(req).pipe(
        map(event => {
          if (event instanceof HttpResponse) {
            const modifiedBody = maskRegistrationNumbers(event.body);
            return event.clone({ body: modifiedBody });
          }
          return event;
        })
      );
    })
  );
};
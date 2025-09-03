
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

// Helper function to recursively find and mask 'reg' properties
function maskRegistrationNumbers(body: any): any {
  if (!body) {
    return body;
  }

  // If the body is an array, map over it and mask each item
  if (Array.isArray(body)) {
    return body.map(item => maskRegistrationNumbers(item));
  }

  // If the body is an object, check for the 'reg' property
  if (typeof body === 'object' && body !== null) {
    const newBody = { ...body };
    for (const key in newBody) {
      if (key === 'reg' && typeof newBody[key] === 'string' && newBody[key].length > 5) {
        const value = newBody[key];
        const firstPart = value.substring(0, 3);
        const lastPart = value.substring(value.length - 2);
        newBody[key] = `${firstPart}*****${lastPart}`;
      } else {
        // Recursively check nested objects
        newBody[key] = maskRegistrationNumbers(newBody[key]);
      }
    }
    return newBody;
  }

  return body;
}


export const maskingInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return authService.isGuest$.pipe(
    take(1), // Take the current guest status
    switchMap(isGuest => {
      // If the user is not a guest, pass the request through without changes
      if (!isGuest) {
        return next(req);
      }
      
      // If the user is a guest, intercept the RESPONSE
      return next(req).pipe(
        map(event => {
          if (event instanceof HttpResponse) {
            const modifiedBody = maskRegistrationNumbers(event.body);
            // Return a new response with the modified body
            return event.clone({ body: modifiedBody });
          }
          // Pass along other event types (like progress)
          return event;
        })
      );
    })
  );
};


import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes';
import { HttpClientModule } from '@angular/common/http';


console.log("At the start of MainTS ")

const combinedConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),  
    provideHttpClient(),    
    provideRouter(routes),         
  ],
};

bootstrapApplication(AppComponent, combinedConfig)
  .catch((err) => console.error(err));


  
 // Import the routes

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ],
}).catch(err => console.error(err));


console.log("At the end of MainTS ")

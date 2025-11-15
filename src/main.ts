import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({ 
      projectId: "distefanopizza-82c84", 
      appId: "1:724682375729:web:1a7fdf8a88c418d8f00b10", 
      storageBucket: "distefanopizza-82c84.firebasestorage.app",
      apiKey: "AIzaSyCpOn6S4DwqDYDp__yUWkCV3c_2dAS8zNU", 
      authDomain: "distefanopizza-82c84.firebaseapp.com", 
      messagingSenderId: "724682375729"})), provideFirestore(() => getFirestore()),
  ],
});

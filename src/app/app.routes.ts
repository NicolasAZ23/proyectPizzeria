import { Routes } from '@angular/router';

// Define la configuración de rutas para la aplicación
export const routes: Routes = [
  {
    // Ruta '/home'
    path: 'home',
    // Carga el componente HomePage de forma lazy (solo cuando se necesita)
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    // Ruta '/login'
    path: 'login',
    // Carga el componente LoginPage de forma lazy
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    // Ruta raíz o vacía ('/')
    path: '',
    // Redirige al usuario inmediatamente a la ruta '/login'
    redirectTo: 'login', 
    // Asegura que solo redirija si la ruta está completamente vacía
    pathMatch: 'full',
  },
  {
    // Ruta '/carrito'
    path: 'carrito',
    // Carga el componente CarritoPage de forma lazy
    loadComponent: () => import('./carrito/carrito.page').then( m => m.CarritoPage)
  },
];
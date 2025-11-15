import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

// Define este componente como una página de la aplicación
@Component({
  selector: 'app-login', // Selector HTML para usarlo (<app-login>)
  templateUrl: './login.page.html', // Archivo HTML de la vista
  styleUrls: ['./login.page.scss'], // Archivo de estilos
  standalone: true, // Indica que es un componente que no necesita un NgModule
  // Importa los módulos necesarios de Ionic y Angular
  imports: [IonicModule, CommonModule, FormsModule] 
})
// Define la clase del componente
export class LoginPage {
  
  // Propiedades que almacenan los datos del formulario de inicio de sesión
  userName: string = ''; // Nombre de usuario (cliente)
  numeroMesa: number | null = null; // Número de mesa asignado
  cantidadPersonas: number | null = null; // Cantidad de comensales
  comentarios: string = ''; // Comentarios o peticiones adicionales

  // Inyecta el servicio Router para poder navegar entre páginas
  constructor(private router: Router) { }

  // Función de ciclo de vida de Ionic: se ejecuta antes de que la vista aparezca
  ionViewWillEnter() {
    // Limpia o reinicia todos los campos del formulario cada vez que se entra a la página
    this.userName = '';
    this.numeroMesa = null;
    this.cantidadPersonas = null;
    this.comentarios = '';
  }

  // Función para manejar el clic en el botón de "Ir a Home"
  goToHome() {
    // 1. Verifica que el nombre de usuario y el número de mesa sean válidos
    if (this.userName && this.userName.trim() !== '' && this.numeroMesa && this.numeroMesa > 0) {
      
      // 2. Crea un objeto con los datos del cliente para pasarlos a la siguiente página
      const infoCliente = {
        nombre: this.userName.trim(), // Guarda el nombre sin espacios al inicio/final
        mesa: this.numeroMesa,
        // Usa 1 como valor predeterminado si el campo de personas está vacío
        personas: this.cantidadPersonas || 1, 
        comentarios: this.comentarios.trim() // Guarda los comentarios sin espacios al inicio/final
      };

      // 3. Navega a la ruta '/home'
      this.router.navigate(['/home'], {
        // Pasa el objeto 'infoCliente' completo a la siguiente página usando el estado de navegación
        state: { cliente: infoCliente }
      });
    } else {
      // Mensaje de error si faltan datos obligatorios (solo se imprime en consola)
      console.log('Faltan campos obligatorios: Nombre de usuario o Número de mesa');
      
    }
  }
}
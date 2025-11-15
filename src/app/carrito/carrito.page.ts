// Importa las herramientas básicas de Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importa herramientas de Ionic (para la UI) y Alertas
import { IonicModule, AlertController } from '@ionic/angular';
// Importa herramientas de Navegación (Router)
import { ActivatedRoute, Router } from '@angular/router';
// Importa tu servicio personalizado de Firebase
import { Firebase } from '../services/firebase'; 

// --- Interfaces (Moldes para los datos) ---

// Define cómo se ve un producto en el carrito
interface ItemPedido {
  name: string;
  price: number;
  cantidad: number;
}

// Define cómo se ven los datos del cliente
interface InfoCliente {
  nombre: string;
  mesa: number;
  personas: number;
  comentarios: string;
}
// --- Fin Interfaces ---

// Configuración de la página
@Component({
  selector: 'app-carrito', // Etiqueta HTML: <app-carrito>
  templateUrl: './carrito.page.html', // Archivo de vista
  styleUrls: ['./carrito.page.scss'], // Archivo de estilos
  standalone: true, // Componente autónomo (moderno)
  imports: [IonicModule, CommonModule, FormsModule] // Dependencias que usa
})
// Define la clase de la página
export class CarritoPage implements OnInit {
  
  // --- Propiedades de la clase ---
  infoCliente: InfoCliente | null = null; // Guarda los datos del cliente
  items: ItemPedido[] = []; // Guarda la lista de productos
  subtotal: number = 0; // Guarda el subtotal
  totalPagar: number = 0; // Guarda el total final

  // Pide las herramientas que va a necesitar
  constructor(
    private route: ActivatedRoute, 
    private router: Router, // Para navegar entre páginas
    private alertCtrl: AlertController, // Para mostrar alertas
    private firebaseService: Firebase // Tu servicio para guardar en Firebase
  ) {}

  // Función que se ejecuta al cargar la página
  ngOnInit() {
    // Intenta leer los datos del pedido que envió la página 'Home'
    const state = this.router.getCurrentNavigation()?.extras.state;
    
    // Si hay datos en el 'state', los guarda
    if (state && state['pedido']) {
      const pedido = state['pedido'];
      // Guarda la info del cliente y los productos
      this.infoCliente = pedido.infoCliente;
      this.items = pedido.items;
      // Calcula el precio
      this.calcularTotales();
    } else {
      // Si no hay datos (ej. recargó la página), regresa al Home
      this.router.navigate(['/home']);
    }
  }

  // Calcula el total sumando (precio * cantidad) de cada item
  calcularTotales() {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
    this.totalPagar = this.subtotal; // El total es igual al subtotal
  }

  

  // Envía el pedido completo a Firebase
  async enviarPedido() {
    // 1. Prepara el objeto final para la base de datos
    // ESTE OBJETO COINCIDE AHORA CON EL TIPO 'PedidoData' del servicio de Firebase.
    const pedidoAEnviar = {
      infoCliente: this.infoCliente, // Se envía el objeto completo del cliente (anidado)
      items: this.items,   // Añade los productos
      subtotal: this.subtotal,
      totalPagar: this.totalPagar,
    };
    
    // 2. Intenta guardar el pedido (try/catch para manejar errores)
    try {
      // Llama al servicio de Firebase y espera la respuesta
      await this.firebaseService.guardarPedido(pedidoAEnviar);
      
      // 3. Si todo sale bien, muestra alerta de éxito
      const alert = await this.alertCtrl.create({
        header: '¡Pedido Enviado! 🎉',
        message: `Su orden ha sido registrada exitosamente. Total: $${this.totalPagar.toFixed(2)}.`,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              // 4. Al aceptar, regresa al Login (para limpiar todo)
              this.router.navigate(['/login']); 
            }
          }
        ]
      });
      await alert.present();

    } catch (error) {
      // 5. Si Firebase falla, muestra una alerta de error
      console.error('Error al guardar en Firebase:', error);
      const alertError = await this.alertCtrl.create({
        header: 'Error al Enviar',
        message: 'Hubo un problema al guardar el pedido. Intente de nuevo.',
        buttons: ['Aceptar']
      });
      await alertError.present();
    }
  }

  // Función para volver al menú (página Home)
  continuarComprando() {
    this.router.navigate(['/home']);
  }
}
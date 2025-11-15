// Importa las herramientas necesarias de Angular e Ionic
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

// --- Interfaces (Moldes para los datos) ---
interface Category {
  id: string;
  name: string;
}
interface Article {
  brand: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
  category: string;
  cantidad: number; // Contador de items pedidos
}
interface Promotion {
  name: string;
  price: number;
  image: string;
  cantidad: number; // Contador de items pedidos
}
// Define la estructura de los datos del cliente
interface Cliente {
  nombre: string;
  mesa: number;
  personas: number;
  comentarios: string;
}
// --- Fin Interfaces ---

// Configuración de la página (componente)
@Component({
  selector: 'app-home', // Nombre de la etiqueta HTML (<app-home>)
  templateUrl: './home.page.html', // Archivo HTML de la vista
  styleUrls: ['./home.page.scss'], // Archivo de estilos
  standalone: true, // Indica que es un componente moderno (no necesita NgModule)
  imports: [IonicModule, CommonModule, FormsModule] // Módulos que usa esta página
})
export class HomePage implements OnInit {

  // Variable para guardar los datos del cliente (que vienen del login)
  infoCliente: Cliente | null = null; 
  
  // --- Listas de Productos y Categorías ---
  categories: Category[] = [
    { id: 'pizzas', name: 'Pizzas' },
    { id: 'pastas', name: 'Pastas' },
    { id: 'complementos', name: 'Complementos' },
    { id: 'bebidas', name: 'Bebidas' },
  ];
  activeCategory: string = 'pizzas'; // Categoría activa por defecto

  // Lista de promociones
  promotions: Promotion[] = [
    { name: 'Promoción Casera', price: 10.99, image: 'assets/images/pizzaMorada.jpg', cantidad: 0 }, 
    { name: 'Champiñones Fest', price: 10.99, image: 'assets/images/pizzaChampinon.jpg', cantidad: 0 },
    { name: 'Pepperoni Day', price: 10.99, image: 'assets/images/pizzaPeperoni.jfif', cantidad: 0 },
    { name: 'Extra Cheese', price: 12.99, image: 'assets/images/pizzaEQueso.jfif', cantidad: 0 }
  ];

  // Lista COMPLETA de todos los productos
  allArticles: Article[] = [
    { brand: 'Marca', name: 'Pizza Suprema', description: 'Salsa de tomate, mozzarella, pepperoni, jamón, pimiento verde, cebolla morada y champiñones.', quantity: 1, price: 10.99, image: 'assets/images/pizzaSuprema.jpg', category: 'pizzas', cantidad: 0 },
    { brand: 'Marca', name: 'Pizza Hawaiana', description: 'Jamón y piña', quantity: 1, price: 8.99, image: 'assets/images/pizzaHawaiana.jpeg', category: 'pizzas', cantidad: 0 },
    { brand: 'Marca', name: 'Pizza Americana', description: 'Mozzarella, salsa de tomate, jamón y pepperoni', quantity: 1, price: 8.99, image: 'assets/images/pizzaAmericana.jpg', category: 'pizzas', cantidad: 0 },
    { brand: 'Pastas Co.', name: 'Fetuccini Alfredo', description: 'Crema, pollo y parmesano', quantity: 1, price: 11.50, image: 'assets/images/fetuchini.jpg', category: 'pastas', cantidad: 0 },
    { brand: 'Bebidas Inc.', name: 'Agua mineral', description: 'Botella de 500ml', quantity: 1, price: 1.50, image: 'assets/images/awa.png', category: 'bebidas', cantidad: 0 },
    { brand: 'Side Co.', name: 'Pan de ajo', description: '6 unidades de pan de ajo', quantity: 1, price: 4.00, image: 'assets/images/panconajo.png', category: 'complementos', cantidad: 0 },
    { brand: 'Bebidas Inc', name: 'Coca cola', description: 'Coca cola litro y medio', quantity: 1, price: 7.50, image: 'assets/images/coca.png', category: 'bebidas', cantidad: 0 },
  ];

  // Lista VACÍA que se llenará con los productos FILTRADOS
  articles: Article[] = [];

  // Pide las herramientas que necesita la página (Navegación y Alertas)
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  // Función que se ejecuta al cargar la página
  ngOnInit() {
    // 1. Intenta leer los datos del cliente que se enviaron desde el Login/Carrito
    const state = this.router.getCurrentNavigation()?.extras.state;
    
    if (state && state['cliente']) {
      // Caso 1: Vienes del Login.
      this.infoCliente = state['cliente']; // Guarda la data del cliente.
      this.resetearContadores(); // Resetea contadores para el nuevo cliente.
    } else if (!this.infoCliente) {
       // Caso 2: No vienes del Login Y no hay cliente guardado (recarga directa o error).
       // En este caso, manda al Login para pedir los datos.
       this.router.navigate(['/login']);
       return;
    }
    
    // 2. Muestra las 'pizzas' (categoría por defecto) al iniciar
    this.filterArticles(this.activeCategory);
  }

  // Pone en 0 todos los contadores de productos
  resetearContadores() {
    this.promotions.forEach(p => p.cantidad = 0);
    this.allArticles.forEach(a => a.cantidad = 0);
  }

  // Cambia los productos que se muestran en la lista 'articles'
  filterArticles(categoryId: string) {
    this.activeCategory = categoryId; // Guarda la categoría activa
    // Filtra la lista completa y guarda el resultado en 'articles'
    this.articles = this.allArticles.filter(
      (article) => article.category === categoryId
    );
  }

  // Suma o resta al contador de un producto (se llama desde los botones + y -)
  modificarCantidad(item: Article | Promotion, cambio: number) {
    item.cantidad += cambio;
    // Impide que el contador sea menor que 0
    if (item.cantidad < 0) {
      item.cantidad = 0;
    }
  }

  // Cuenta cuántos items hay en total en el carrito (para el ícono del carrito)
  getCarritoTotalItems(): number {
    let total = 0;
    // Suma las cantidades de promociones y artículos
    this.promotions.forEach(p => total += p.cantidad);
    this.allArticles.forEach(a => total += a.cantidad);
    return total;
  }

  // Se llama al presionar el botón de "Ir al Carrito"
  async irAlCarrito() {
    // 1. Junta todos los productos que tengan cantidad mayor a 0
    const promosEnCarrito = this.promotions.filter(p => p.cantidad > 0);
    const articulosEnCarrito = this.allArticles.filter(a => a.cantidad > 0);
    
    // 2. Los une en una sola lista
    const carrito = [...promosEnCarrito, ...articulosEnCarrito];

    // 3. Revisa si el carrito está vacío
    if (carrito.length === 0) {
        console.log('El carrito está vacío. No se puede navegar.');
        // Muestra una alerta si no hay productos
        const alert = await this.alertCtrl.create({
            header: 'Carrito Vacío',
            message: 'Aún no has añadido productos a tu pedido.',
            buttons: ['Aceptar']
        });
        await alert.present();
        return; // Detiene la función aquí
    }

    // 4. Prepara el paquete de datos (Cliente + Ítems) para enviar
    const dataParaCarrito = {
      infoCliente: this.infoCliente,
      items: carrito
    };

    // 5. Configura la navegación para llevar esos datos
    const extras: NavigationExtras = {
      state: {
        pedido: dataParaCarrito
      }
    };

    // 6. Envía al usuario a la página /carrito con los datos
    this.router.navigate(['/carrito'], extras);
  }
}
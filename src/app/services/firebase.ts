import { Injectable } from '@angular/core';
// Importa las herramientas de Firestore necesarias:
// Firestore: El servicio principal de la base de datos
// collection: Para crear referencias a colecciones (como 'pedidos')
// addDoc: Para añadir un nuevo documento
// serverTimestamp: Para registrar la fecha y hora exactas en el servidor
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

// --- Interfaces para definir la estructura de los datos ---

// Molde de un producto
interface ItemPedido {
  name: string;
  price: number;
  cantidad: number;
}

// Molde de la información del cliente/mesa
interface InfoCliente {
  nombre: string;
  mesa: number;
  personas: number;
  comentarios: string;
}

// Molde completo de lo que recibe la función guardarPedido
interface PedidoData {
  infoCliente: InfoCliente | null; // Datos de la mesa
  items: ItemPedido[]; // Lista de productos
  subtotal: number;
  totalPagar: number;
}
// --- Fin Interfaces ---


// Marca esta clase como un "Servicio" disponible en toda la app
@Injectable({
  providedIn: 'root'
})
// Clase para manejar toda la lógica de la base de datos
export class Firebase { 

  // Constructor: Pide el servicio de Firestore para poder usar la base de datos
  constructor(private firestore: Firestore) { }

  /**
   * Guarda un nuevo pedido en la colección 'pedidos'.
   * @param data Objeto con todos los datos del pedido.
   * @returns Promesa de adición de documento.
   */
  guardarPedido(data: PedidoData) { 
    // 1. Crea una referencia a la colección de la base de datos llamada "pedidos"
    const pedidosCollection = collection(this.firestore, 'pedidos');

    // 2. Combina los datos del pedido con información adicional (fecha y estado)
    const datosConExtras = {
      // Descompone y añade los campos de infoCliente (nombre, mesa, etc.)
      ...data.infoCliente, 
      // Añade los productos, subtotal y total
      items: data.items, 
      subtotal: data.subtotal,
      totalPagar: data.totalPagar,
      
      fecha: serverTimestamp(), // Marca el momento exacto en que se creó el pedido
      estado: 'pendiente'       // Todo pedido nuevo comienza como 'pendiente'
    };

    // 3. Envía el objeto final a la base de datos y le pide que le asigne un ID automático
    return addDoc(pedidosCollection, datosConExtras);
  }
}
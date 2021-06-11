import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {

 private carrito = [];
 private carritoNumeroItems = new BehaviorSubject(0);

  constructor() { 
   
  }

  getCarrito(){
    return this.carrito;
  }

  obtenercarritoNumeroItems(){
    return this.carritoNumeroItems;
  }

  bajarCantidadProducto(product){
    for (let [index, p] of this.carrito.entries()) {
      if(p.id === product.id){
        p.cantidad -= 1;if(p.cantidad == 0){
          this.carrito.splice(index, 1);
        }
      }
    }
    this.carritoNumeroItems.next(this.carritoNumeroItems.value -1);
  }

  removeProducto(producto){
    for(let [index, p] of this.carrito.entries()){
      if(p.id === producto.id){
        this.carritoNumeroItems.next(this.carritoNumeroItems.value - p.cantidad);
        this.carrito.splice(index, 1);
      }
    }
  }
  
  addProducto(producto){
    let agregado = false;
    for(let p of this.carrito){
      if(p.id === producto.id){
        p.cantidad +=1;
        agregado = true;
        break;
      }
    }

    if(!agregado){
      this.carrito.push(producto);

    }
    this.carritoNumeroItems.next(this.carritoNumeroItems.value + 1);
  
  }
}

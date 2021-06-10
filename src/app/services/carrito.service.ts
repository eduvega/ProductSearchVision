import { Router } from 'express';
import { FirestoreService } from './firestore.service';
import { Pedido, Producto, ProductoPedido } from '../interfaces/modelo';
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



  /* loadCarrito(){
    const path = 'Compras/' + this.id + '/' + this.path;
    this.firestoreService.getDoc<Pedido>(this.path, this.id).subscribe(res =>{
      if(res){
        this.pedido = res
      }else{
        this.initCarrito();
      }
    })
  }

  initCarrito(){
    this.pedido = {
      id: this.id,
      productos: [],
      precioTotal: null
    }
  }
  


  addProducto(producto: Producto){
    const item = this.pedido.productos.find( prodcutoPedido =>{
      return(prodcutoPedido.producto.id === producto.id)
    }); 
    if(item!== undefined){
      item.cantidad++;
    } else{
      const add: ProductoPedido = {
        cantidad: 1,
        producto: producto,

      }
      this.pedido.productos.push(add)
    }
    console.log('en addProducto ->', this.pedido)
  }
  
  

  startPedido(){

  }

  clearCarrito(){

  } */
}

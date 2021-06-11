import { FirestoreService } from '../../services/firestore.service';
import { Component, OnInit } from "@angular/core";
import { Joyeria } from '../../interfaces/modelo';
import { CarritoService } from '../../services/carrito.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit{
  
  private path = 'Joyeria/';
  joyeria: Joyeria[]=[];


  constructor(public _firestoreService: FirestoreService,
              public _carritoService: CarritoService,
              public toastController: ToastController) 

    {this.getProductos();}

  ngOnInit(){

  }

  getProductos(){
    this._firestoreService.getCollection<Joyeria>(this.path).subscribe( res=>{
      this.joyeria = res;
    });
  }


  addCarrito(product){
    product.cantidad=1;
    this.presentToast();
    this._carritoService.addProducto(product);
    
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'añadido correctamente.',
      duration: 2000
    });
    toast.present();
  }

  
}

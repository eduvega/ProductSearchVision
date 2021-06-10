import { CarritoService } from './../../services/carrito.service';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Producto } from '../../interfaces/modelo';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  productos: Producto [] = [];
  @Input() datoscaneado: string;
  private path = 'Productos/';
  image:any
  @Input() result: any;

  constructor(
   
    public _firestoreService: FirestoreService,
    public route: ActivatedRoute,
    public nav: NavController,
    private modalController: ModalController,
    public toastController: ToastController,
    public _carritoService: CarritoService,
) {}

  ngOnInit() {
    this.pruebaLogSinModal();
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

   closeModel() {
    this.modalController.dismiss();
  }

  async pruebaLogSinModal(){
    this._firestoreService.getCollectionParametro<Producto>(this.path, 'codigoBarras', this.datoscaneado)
    .subscribe(res  => {
      console.log(res);
      this.productos = res;
      console.table(this.productos);
    });
  }
   
}

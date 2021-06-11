import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { CarritoService } from '../../services/carrito.service';
import { Joyeria } from '../../interfaces/modelo';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  carrito: Joyeria[] =[]

  constructor(
    private _carritoService: CarritoService,
    private modalCtrl: ModalController,
    private alert: AlertController
    ) { }

  ngOnInit() {
    this.carrito = this._carritoService.getCarrito();
  }

  bajarCantidad(product){
    this._carritoService.bajarCantidadProducto(product);
  }

  aumentarItemCarrito(product){
    this._carritoService.addProducto(product);
  }

  removerCarritoItem(product){
    this._carritoService.removeProducto(product);
  }

  obtenerTotal(){
    return this.carrito.reduce((i, j) => i + j.precio * j.cantidad, 0);
  }

  async checkOut(){
    let alert = await this.alert.create({
      header: 'Gracias por su compra!',
      message: 'Vuelva pronto',
      buttons: ['OK']
    });
    alert.present().then(()=>{
      this.modalCtrl.dismiss();
    });
  }
}

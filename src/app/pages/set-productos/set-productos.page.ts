import { FireStorageService } from '../../services/fire-storage.service';
import { Joyeria } from '../../interfaces/modelo';
import { FirestoreService } from '../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.page.html',
  styleUrls: ['./set-productos.page.scss'],
})
export class SetProductosPage implements OnInit {

  /**
   * Atributos de la clase
   */
  private path = 'Joyeria/';
  joyeria: Joyeria [] = []
  newJoyeria: Joyeria;
  enableNewProduct = false;
  loading: any;
  newFile = '';
  datoscaneado: string;
  
  constructor(public _firestoreService: FirestoreService,
              public _loadingController: LoadingController,
              public _toastController: ToastController,
              public _alertController: AlertController,
              public _fireStorage: FireStorageService,
             ) { }

  ngOnInit() {
    this.getProductos();
  }

  async guardarProducto(){
    this.presentLoading();
    const name = this.newJoyeria.descripcion;
    const res = await this._fireStorage.uploadImage(this.newFile, this.path, name);
    this.newJoyeria.foto = res;
    this._firestoreService.createDoc(this.newJoyeria, this.path, this.newJoyeria.codigo).then( res=> {
      this.loading.dismiss();
      this.presentToast('Guardado con exito');
    }).catch(error =>{
      this.presentToast('No se pudo guardar');
      console.log(error)
    })
  }

  getProductos(){
    this._firestoreService.getCollection<Joyeria>(this.path).subscribe( res=>{
      this.joyeria = res;
    });
  }

  async borrarProducto(joyeria: Joyeria){

    const alert = await this._alertController.create({
      cssClass: 'my-custom-class',
      header: 'Advertencia',
      message: '¿Seguro desea <strong>eliminar</strong> este producto?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this._firestoreService.deleteDoc(this.path, joyeria.codigo).then( res=> {
              this.presentToast('Eliminado con exito');
              this._alertController.dismiss();
            }).catch( error =>{
              this.presentToast('No se pudo elimar');
            })
    
          }
        }
      ]
    });
    await alert.present();
  }
  
  nuevo(){
    this.enableNewProduct = true;
    this.newJoyeria = {
      EAN: '',
      precio: null,
      descripcion: '' ,
      foto: '',
      codigo: ''
    };
    
  }

  /* Metodo que muestra la imagen que el usuario a elegido y va a subir */
  async newImageUpload(event: any){
    console.log(event)
    if (event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newJoyeria.foto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    } 
  }

  async presentLoading() {
    this.loading = await this._loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Guardando...',
    });
    await this.loading.present();
  
  }

  async presentToast(msg: string) {
    const toast = await this._toastController.create({
      message: msg,
      duration: 2000,
      color: 'warning',
    });
    toast.present();
  }

}

import { Component, OnInit} from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, LoadingController } from '@ionic/angular';
import { CameraResultType, Camera } from "@capacitor/camera";
import { Joyeria } from '../../interfaces/modelo';
import { FirestoreService } from '../../services/firestore.service'
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  modelData: any;

  /**
   * Atributos camera
   */
  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  /**
   * Atributos Search y base de datos
   */
  joyeria: Joyeria [] = [];
  eanValue: string;
  score: number;
  private path = 'Joyeria/';

  /**
   * Atributos Scanner
   */
  datoscaneado: string;


  constructor(
    private alertCtrl: AlertController,
    private _storage: AngularFireStorage,
    public _firestoreService: FirestoreService,
    public _database: AngularFirestore,
    public nav: NavController,
    private barcodeScanner: BarcodeScanner,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private http: HttpClient,
    public _toastController: ToastController,
    public _carritoService: CarritoService,
  ) {

  }
  ngOnInit() {
    
  }

  getCodigoBarras(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.datoscaneado = barcodeData.text;
    this._firestoreService.getCollectionParametro<Joyeria>(this.path, 'EAN', this.datoscaneado)
    .subscribe(res  => {
      console.log(res);
      console.log(this.datoscaneado);
      this.joyeria = res;
      console.table(this.joyeria);
    });
    }).catch(err => {
      console.log('Error', err);
   })
  }


  /**
   * Metodo que realiza una peticion JSON con la imagen que se hace o se escoge de la galeraia.
   * Esta foto viaja por la API de Vision y devuelve una respuesta JSON con las imagenes coincidentes.
   * Elegimos la que mas valor de confianza tenga, capturamos el EAN asociado a ese producto coincidente
   * Por ultimo, se manda este codigo EAN a la base de datos Firebase y pintamos el producto gracias a este 
   */
  async searchProduct(){

    const header = new HttpHeaders();
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json');
    const option2 = {
      headers: header,
      params: new HttpParams().append('key', environment.googleCloudVisionAPIKey)
        
    }
    const options = {
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    };

    const image = await Camera.getPhoto(options);

    const imageUrl = image.base64String;
  
    const body ={
      "requests": [
        {
          "image": {
              "content": imageUrl
          },
          "features": [
            {
              "type": "PRODUCT_SEARCH",
              "maxResults": 1
            }
          ],
          "imageContext": {
            "productSearchParams": {
              "productSet": "projects/productsearchvision/locations/us-west1/productSets/catalog",
              "productCategories": [
                   "general-v1"
              ]
            }
          }
        }
      ]
    };
    this.http.post<Joyeria>('https://vision.googleapis.com/v1/images:annotate', body, option2)
    .subscribe(data => {
      const results = data['responses'][0]['productSearchResults']['results'];
      results.forEach(async result => { 
        console.log(result)
        this.score = result.score;
    
        if(this.score >= 0.4){
          this.eanValue = result['product'].productLabels[0]['value'];
         
          this.presentToast('Busqueda exitosa');
          
        }else{
          this.presentToast('No se pudo encontrar coincidencia');
          return false;
        }
        });
        this._firestoreService.getCollectionParametro<Joyeria>(this.path, 'EAN', this.eanValue)
        .subscribe(res => {
          console.log(res);
          this.joyeria = res

         
        });
    });
  }

  
  addCarrito(product){
    product.cantidad=1;
    this.presentToast('añadido correctamente');
    this._carritoService.addProducto(product);
    
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

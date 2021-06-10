import { Component, OnInit} from '@angular/core';
/* import { Camera, CameraOptions } from "@ionic-native/camera/ngx"; */
import { AngularFireStorage } from "@angular/fire/storage";
import { AlertController, NavController } from "@ionic/angular";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, NavigationExtras } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { CameraResultType, CameraSource, Camera } from "@capacitor/camera";

import { Producto } from '../../interfaces/modelo';
import { FirestoreService } from '../../services/firestore.service'
import { ResultsPage } from '../results/results.page'
import { PhotoService } from "../../services/photo.service";
import { ScanServiceService } from '../../services/scan-service.service'
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

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
   * Atributos Scanner
   */
  private path = 'Productos/';
  private path1 = 'Joyeria/';
  datoscaneado: string;
  productos: Producto [] = []

  constructor(
    private alertCtrl: AlertController,
    private _storage: AngularFireStorage,
    private _photoService: PhotoService,
    private _scanServiceService: ScanServiceService,
    public _firestoreService: FirestoreService,
    public _database: AngularFirestore,
    public nav: NavController,
    private barcodeScanner: BarcodeScanner,
    public modalController: ModalController,
    private route : Router,
 /*    private camera: Camera, */
    public loadingController: LoadingController,
    private http: HttpClient
  ) {

  }
  ngOnInit() {
    
  }
  /**
   * MEtodo que hace llamada a la api
   */




  tomarFoto(){
    this._photoService.takePicture();

  }

  async getSimilarProducts(){
   /*  const options= {
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      }
      Camera.getPhoto(options).then(async (imageData) => { */
        /* const loading = await this.loadingController.create({
        message: 'Getting Results...',
        translucent: true
        });
        await loading.present(); */
     /*  this._scanServiceService.getSimilarProducts().subscribe(async (result) => {
      console.log(result)
       */

      /* let navigationExtras: NavigationExtras = {
      queryParams: {
      special: JSON.stringify(imageData),
      result : JSON.stringify(result),
      }};
      this.route.navigate(["show-prueba"],navigationExtras)
      await loading.dismiss() */
     /*  }, err => {
      console.log(err);
      }); */
      /* }, err => {
      console.log(err);
      }); */
  }

  pruebaReloj(){
    this._firestoreService.getCollectionParametro<Producto>(this.path1, 'EAN', '8410751099550')
    .subscribe(res  => {
      console.log(res);
    });
  }



  async takePhoto() {
    /* this.base64Image = await this._photoService.takePicture();
    this.getSimilarProducts() */
    /* this.upload(); */
  }

  /* async getCodigoBarras(){
    this.barcodeScanner.scan().then(async barcodeData => {
      this.datoscaneado = barcodeData.text;
      const modal = await this.modalController.create({
        component: ResultsPage,
        componentProps: {
          datoscaneado: this.datoscaneado 
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.modelData = modelData.data;
          console.log('Modal Data : ' + modelData.data);
        }
      });
      return await modal.present();
   
    }).catch(err => {
      console.log('Error', err);
   })
  } */

  upload(): void {
    const currentDate = Date.now();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `Images/${currentDate}`;
    const fileRef = this._storage.ref(filePath);

    const task = this._storage.upload(`Images/${currentDate}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((downloadURL) => {
            if (downloadURL) {
              this.showSuccesfulUploadAlert();
              this.nav.navigateForward(['/results'])
            }else{
              console.log('no se pudo');
            }
            console.log(downloadURL);
          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
        }
      });
  }

  async showSuccesfulUploadAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: "basic-alert",
      header: "Imagen subida",
      subHeader: "Imagen subida exitosamente a Firebase",
      message: "Checkea Firebase storage.",
      buttons: ["OK"],
    });

    await alert.present();
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(",");
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: "image/png" });
    return blob;
  }


    scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.datoscaneado = barcodeData.text; 

     /*  if(this._database.collection('Productos', ref => 
        ref.where('codigoBarras', '==', this.datoscaneado))){

        console.log("cagondio que he funcionao")
        console.log("🚀 ~ file: tab3.page.ts ~ line 106 ~ Tab3Page ~ ref.where ~ barcodeData", barcodeData)
        
      }else{
        console.log('Error, na hermano prueba otra cosa');
      } */
     }).catch(err => {
         console.log('Error', err);
     });

  }
 
  getCodigoBarras(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.datoscaneado = barcodeData.text;
      
    this._firestoreService.getCollectionParametro<Producto>(this.path, 'codigoBarras', this.datoscaneado)
    .subscribe(res  => {
      console.log(res);
      console.log(this.datoscaneado);
      this.productos = res;
      console.table(this.productos);
    });
    }).catch(err => {
      console.log('Error', err);
   })
  }



  async pruebaLogSinModal(){
    this._firestoreService.getCollectionParametro<Producto>(this.path, 'codigoBarras', '9788423431311')
    .subscribe(res  => {
      console.log(res);
      this.productos = res;
      console.table(this.productos);
    });
  }
  
  
  async pruebaModalHardcodeado(){ 
     this.barcodeScanner.scan().then(async barcodeData => {
      this.datoscaneado = barcodeData.text;
      const modal = await this.modalController.create({
        component: ResultsPage,
        componentProps: {
          datoscaneado: this.datoscaneado 
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.modelData = modelData.data;
          console.log('Modal Data : ' + modelData.data);
        }
      });
      return await modal.present();
   
    }).catch(err => {
      console.log('Error', err);
   }) 
   
    this.datoscaneado = '9788423431311';
    const modal = await this.modalController.create({
      component: ResultsPage,
      componentProps: {
        datoscaneado: this.datoscaneado
        
      }
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
      }
    });

    return await modal.present(); 
   } 

  
  
}




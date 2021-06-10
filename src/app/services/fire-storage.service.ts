import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from "@angular/fire/storage";
import { AlertController } from '@ionic/angular';
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  constructor(private _alertCtrl: AlertController,
              private _storage: AngularFireStorage,
              private camera: Camera) {}


  takePhoto(path: string, nombre: any): Promise<string> {
    return new Promise( resolve => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
      };

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        // Handle error
        console.error(err);
      });
    
      const file: any = this.base64ToImage(this.base64Image);
      const filePath = path + '/' + nombre;
      const fileRef = this._storage.ref(filePath);

      const task = this._storage.upload(filePath, file);
      task.snapshotChanges()
        .pipe(finalize(() => {
          fileRef.getDownloadURL().subscribe(res => {
            const downloadURL = res;
            resolve(downloadURL);
            return;
          })
        })
        ).subscribe()
    });
  }


  uploadImage(file: any, path: string, descripcion: string): Promise<string> {
    return new Promise( resolve => {
      const filePath = path + '/' + descripcion;
      const ref = this._storage.ref(filePath);
      const task = ref.put(file);
      task.snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe( res =>{
            const downloadURL = res;
            resolve(downloadURL);
            return;
          })
        })
     ).subscribe();
    });
  }

/* 
  pickPhoto(): Promise<string> {
    return new Promise( resolve => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
      };

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        // Handle error
        console.error(err);
      });
      
      var currentDate = Date.now();
      const file: any = this.base64ToImage(this.base64Image);
      const filePath = `Images/${currentDate}`;
      const fileRef = this._storage.ref(filePath);

      const task = this._storage.upload(filePath, file);
      task.snapshotChanges()
        .pipe(finalize(() => {
          fileRef.getDownloadURL().subscribe(res => {
            const downloadURL = res;
            resolve(downloadURL);
            return;
          })
        })
        ).subscribe()
    });
  } */

  /* async showSuccesfulUploadAlert() {
    const alert = await this._alertCtrl.create({
      cssClass: 'basic-alert',
      header: 'Uploaded',
      subHeader: 'Image uploaded successful to Firebase storage',
      message: 'Check Firebase storage.',
      buttons: ['OK']
    });

    await alert.present();
  } */

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      return blob;
  }

  
}

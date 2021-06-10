import { Injectable } from "@angular/core";
import { CameraResultType, CameraSource, Camera } from "@capacitor/camera";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: "root",
})
export class PhotoService {

  base64img: string;
  
  constructor(public _fireStorage: AngularFireStorage, public http: HttpClient,  ) {}

  async takePicture() {
    const header = new HttpHeaders();
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json');
    const option2 = {
      headers: header,
      params: new HttpParams().append('key', environment.googleCloudVisionAPIKey)
        
    }

    /* const requestOptions = new HttpRequest({headers: header}) */
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
              "maxResults": 5
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
    console.log(body);
    return this.http.post('https://vision.googleapis.com/v1/images:annotate', body, option2).subscribe(data=>{
      console.log(data);
    });

  }

  



  // addNewToGallery(path: string, nombre: string): Promise<string> {
  //   return new Promise((resolve) => {
  //     // Take a photo
  //     const capturedPhoto = new Camera.({
  //       resultType: CameraResultType.DataUrl,
  //       source: CameraSource.Camera,
  //       quality: 50,
  //       height: 600,
  //       width: 600,
  //     });
  //     const filePath = path + "/" + nombre;
  //     const ref = this._fireStorage.ref(filePath);
  //     const task = ref.put(capturedPhoto);
  //     task
  //       .snapshotChanges()
  //       .pipe(
  //         finalize(() => {
  //           ref.getDownloadURL().subscribe((res) => {
  //             const downloadURL = res;
  //             resolve(downloadURL);
  //             console.log(downloadURL);
  //             return;
  //           });
  //         })
  //       )
  //       .subscribe();
  //   });
  // }

  uploadImage(file: any, path: string, descripcion: string): Promise<string> {
    return new Promise((resolve) => {
      const filePath = path + "/" + descripcion;
      const ref = this._fireStorage.ref(filePath);
      const task = ref.put(file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe((res) => {
              const downloadURL = res;
              resolve(downloadURL);
              return;
            });
          })
        )
        .subscribe();
    });
  }
}

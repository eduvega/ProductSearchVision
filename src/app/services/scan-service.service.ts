import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PhotoService } from '../services/photo.service'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ScanServiceService {

  eans: Observable<any>;

  constructor(public http: HttpClient,
    private photo: PhotoService) { 
    
  }

  getSimilarProducts() {
 /*   const base64img = this.photo.takePicture()
    const body ={
      "requests": [
        {
          "image": {
              "content": base64img
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
    this.eans = this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.googleCloudVisionAPIKey, body)
    this.eans.subscribe(data =>{
      console.log(data);
    }) */
    /*  .pipe(
      map(result =>{
        console.log(result);
      })
    ); */
  }
 

}

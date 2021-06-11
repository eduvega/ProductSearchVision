import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  constructor(private _storage: AngularFireStorage) {}


/**
 * 
 * @param file 
 * @param path 
 * @param descripcion 
 * @returns 
 * 
 * Metodo para subir la imagen a Firebase.
 */

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
  
}

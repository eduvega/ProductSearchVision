import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public _database: AngularFirestore) { }

   /*Creación del documento en base de datos de Firebase*/
   createDoc(data: any, path: string, id: string){
    const collection = this._database.collection(path);
    return collection.doc(id).set(data);
  }

  /*Función que permite la lectura del documento gracias al id*/
  getDoc<tipo>(path: string, codigo: string){
    const collection = this._database.collection<tipo>(path);
    return collection.doc(codigo).valueChanges()
  }

 /*Función que permite borrar del documento gracias al id*/
  deleteDoc(path: string, id: string){
    const collection = this._database.collection(path);
    return collection.doc(id).delete();
  }

  /*Función que permite actualizar del documento gracias al id*/
  updateDoc(data: any, path: string, codigo: string){
    const collection = this._database.collection(path);
    return collection.doc(codigo).update(data);
  }
  
  /*Función que nos retorna un id*/ 
  getId(){
    return this._database.createId()
  }

  /*Función que trae todos los datos de la bbdd con un observador*/
  getCollection<tipo>(path: string){
    const collection = this._database.collection<tipo>(path);
    return collection.valueChanges();
  }

/**
 * 
 * @param path 
 * @param parametro 
 * @param value 
 * @returns 
 * 
 * Funcion para realizar consultas a la base de datos
 * en este caso buscamos uno con los parametros de igualacion
 */
  getCollectionParametro<tipo>(path: string, parametro: string, value: string){
    const dataCollection: AngularFirestoreCollection<tipo>=
    this._database.collection<tipo>(path, ref=>
      ref.where(parametro, '==', value));

    return dataCollection.valueChanges();
  }

}

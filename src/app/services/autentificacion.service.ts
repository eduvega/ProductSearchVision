import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class AutentificacionService {
  
  user = null;

  constructor(  
    private afAuth: AngularFireAuth,
   ) { 
    }

    registerUser(value) {
      return new Promise<any>((resolve, reject) => {
  
        this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
          .then(
            res => resolve(res),
            err => reject(err))
      })
    }

    loginUser(value) {
      return new Promise<any>((resolve, reject) => {
        this.afAuth.signInWithEmailAndPassword(value.email, value.password)
          .then(
            res => resolve(res),
            err => reject(err))
      })
    }

    logoutUser() {
      return new Promise<void>((resolve, reject) => {
        if (this.afAuth.currentUser) {
          this.afAuth.signOut()
            .then(() => {
              console.log("LOG Out");
              resolve();
            }).catch((error) => {
              reject();
            });
        }
      })
    }
  
    userDetails() {
      return this.afAuth.user
    }

    async loginWithGoogle() {
      return await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    }
}

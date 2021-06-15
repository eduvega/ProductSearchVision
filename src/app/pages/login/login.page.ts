import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AutentificacionService } from '../../services/autentificacion.service';
import firebase from "firebase/app";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';
  user = null;


  constructor(private navCtrl: NavController,
    private authService: AutentificacionService,
    private formBuilder: FormBuilder,
    public fireAuth: AngularFireAuth) {

      this.fireAuth.authState.subscribe((user) => {
        this.user = user ? user : null;
      });

     }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'El Email es requerido.' },
      { type: 'pattern', message: 'Por favor, introduce un email valido.' }
    ],
    'password': [
      { type: 'required', message: 'La Contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener minimo 6 caracteres.' }
    ]
  };


  loginUser(value) {
    this.authService.loginUser(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward('/tabs/home');
      }, err => {
        this.errorMessage = err.message;
      })
  }

  loginGoogle() {
    this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.navCtrl.navigateForward('/tabs/home');
    }, err => {
      this.errorMessage = err.message;
    });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }


}

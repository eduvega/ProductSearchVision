import { Component, OnInit } from '@angular/core';
import { AutentificacionService } from './services/autentificacion.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  userEmail: string;

  constructor(
    private navCtrl: NavController,
    private authService: AutentificacionService,
  ) {}

  ngOnInit() {
    this.authService.userDetails().subscribe(res => {
      console.log('res:', res);
      if (res !== null) {
        this.userEmail = res.email;
      } else {
        this.navCtrl.navigateBack('/login');
      }
      
    }, err => {
      console.log('err', err);
    })
  }

  logOut() {
    this.authService.logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('/login');
      })
      .catch(error => {
        console.log(error);
      })
  }
}

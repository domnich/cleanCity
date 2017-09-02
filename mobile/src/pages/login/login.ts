import {Component} from '@angular/core';
import {NavController, ToastController, LoadingController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {MainPage} from '../../pages/pages';

import {User} from '../../providers/user';

import {TranslateService} from '@ngx-translate/core';
import {SignupPage} from '../signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              private storage: Storage, private loader: LoadingController ) {
    //this.storage.remove('user');
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

    // let spinner = this.loader.create({
    // });
    // spinner.present();
  }

  // Attempt to login in through our User service
  doLogin() {
    let spinner = this.loader.create({
       dismissOnPageChange: true
    });
    spinner.present();
    this.user.login(this.account).subscribe((resp) => {

     if(resp.status == 200) {
       let user = JSON.parse(resp['_body']).user,
         token = JSON.parse(resp['_body']).token;
       user.token = token;


       this.storage.set('user', user).then((response) => {

         setTimeout(() => {
           this.navCtrl.push(MainPage);
           spinner.dismiss();
         }, 100);

       });
     }



      // this.navCtrl.push(MainPage);
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });


  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}

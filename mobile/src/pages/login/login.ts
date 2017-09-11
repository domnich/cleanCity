import {Component} from '@angular/core';
import {NavController, ToastController, LoadingController} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
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
    email: '',
    password: ''
  };
  private loginErrorString: string;
  loginForm: FormGroup;
  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              private storage: Storage,
              private formBuilder: FormBuilder,
              private loader: LoadingController ) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });



    this.createForm();
  }

  test() {
    console.log(this.loginForm.get('email'))
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

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

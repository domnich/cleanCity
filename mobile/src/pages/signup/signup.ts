import {Component} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import {NavController, ToastController, LoadingController} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult} from '@ionic-native/native-geocoder';
import {MainPage} from '../../pages/pages';
import {User} from '../../providers/user';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  masks: any;
  account: {username?: string, phone?: string, email?: string, password?: string, city?: string, street?: string, confirmPassword?: string, organization?: string} = {
    email: '',
    username: '',
    phone: '',
    organization: '',
    city: '',
    street: '',
    password: '',
    confirmPassword: ''
  };

  // Our translated text strings
  private signupErrorString: string;
  private isSettingsPage: any;
  private pageTitleKey: string;
  private pageTitle: string | any;
  form: FormGroup;
  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              private storage: Storage,
              private loader: LoadingController,
              private formBuilder: FormBuilder) {
      this.storage.get('user').then((user) => {

      this.isSettingsPage = user && user.hasOwnProperty('token');
      if(this.isSettingsPage) {
        this.account = user;
        this.createForm(this.account);
      } else {
        this.createForm();
      }
    });
      //pattern="/^\(\d{3}\) \d{3}-\d{2}-\d{2}$/"


    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    });

    this.createForm();
  }

  createForm(account?) {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      username: [null, [Validators.required], this.customValidator()],
      phone: [null, [Validators.required]],
      organization: [null],
      city: [null],
      street: [null],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }


  customValidator() {
    console.log(this)
  }

  signup() {
    let spinner = this.loader.create({
      //   dismissOnPageChange: true
    });
    spinner.present();
    this.user.signup(this.account).subscribe((resp) => {
      if (resp.status == 200) {
        let user = JSON.parse(resp['_body']).user;
        this.user.login(this.account).subscribe((resp) => {
          if (resp.status == 200) {
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
          // this.navCtrl.push(MainPage);
          // // Unable to log in
          // let toast = this.toastCtrl.create({
          //   message: this.loginErrorString,
          //   duration: 3000,
          //   position: 'top'
          // });
          // toast.present();
        });
      }
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  detectPosition() {
    this.geolocation.getCurrentPosition().then(pos => {
      alert('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);

      this.nativeGeocoder.reverseGeocode(pos.coords.latitude, pos.coords.longitude)
        .then((result: NativeGeocoderReverseResult) => {
          console.log(result)

          this.account.city = result['locality'];
          this.account.street = result['thoroughfare'] + ' ' + result['subThoroughfare'];
        })
        .catch((error: any) => console.log(error));
    });
  }

  ionViewWillEnter() {
    this.pageTitleKey = this.isSettingsPage ? 'SETTINGS_PAGE_PROFILE' : 'SIGNUP';
    this.translateService.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })
  }

  updateUser() {
    let spinner = this.loader.create();
    spinner.present();
    // delete this.account['passwordConf'];
    // delete this.account['password'];
    delete this.account['token'];


    this.user.updateUser(this.account).subscribe((resp) => {
      this.storage.get('user').then((user) => {
        let updatedUser = JSON.parse(resp['_body']).user,
          token = JSON.parse(resp['_body']).token;

        if(token) {
          updatedUser.token = token;
        } else if(!updatedUser.hasOwnProperty('token')) {
          updatedUser.token = user.token;
        }

        this.storage.set('user', updatedUser);

        spinner.dismiss();
      });
    });

  }

  logout() {
    this.storage.remove('user');
    this.navCtrl.parent.parent.setRoot(LoginPage);
  }

}

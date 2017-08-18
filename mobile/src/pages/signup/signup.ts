import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController, ToastController } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name?: string, email?: string,  password?: string, city?: string, street?: string, confirmPassword?: string, organization?: string } = {

  };

  // Our translated text strings
  private signupErrorString: string;
  private isSettingsPage: any;
  private pageTitleKey: string;
  private pageTitle: string|any;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder, private storage: Storage) {


    this.storage.get('user').then((val) => {
      this.isSettingsPage = val;
    });


    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {

      this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

      // Unable to sign up
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

  logout() {
    this.storage.remove('user');
    this.navCtrl.parent.parent.setRoot(LoginPage);
  }

}

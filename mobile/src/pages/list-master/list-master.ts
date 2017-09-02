import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ItemCreatePage } from '../item-create/item-create';
import { ItemDetailPage } from '../item-detail/item-detail';
import { LoginPage } from '../login/login';
import { Items } from '../../providers/providers';
import {User} from '../../providers/user';
import { Item } from '../../models/item';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public items: Items, public modalCtrl: ModalController, private storage: Storage, private userService: User, private loader: LoadingController) {
    this.currentItems = this.items.query();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create(ItemCreatePage);
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }
  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

  throwTrash() {
    let spinner = this.loader.create({
      content: 'Обработка запроса...'
    });
    spinner.present();

    this.userService.throwTrash({}).subscribe((resp) => {

      let toast = this.toastCtrl.create({
        message: 'Заявка отправлена, мы вывезем мусор в ближайщие пару дней',
        duration: 3000,
        position: 'top'
      });
      toast.present();

      spinner.dismiss();
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: 'Что то пошло не так... Пожалуйста повторите попытку или наберите нас на телефон',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

  }

  logout() {
    this.storage.remove('user');
    this.navCtrl.parent.parent.setRoot(LoginPage);
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TreasurePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-treasure',
  templateUrl: 'treasure.html',
})
export class TreasurePage {
  treasure;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.treasure="Non-Technical"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TreasurePage');
  }

}

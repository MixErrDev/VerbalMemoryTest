import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {NgTemplateOutlet} from "@angular/common";
import { FormsModule }   from "@angular/forms";
import { HttpClientModule }   from "@angular/common/http";
import {Asset} from "../models/asset";
import {AssetService} from "../services/asset.service";

@Component({
  selector: 'assets-component',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgTemplateOutlet],
  templateUrl: './assets.component.html',
  providers: [AssetService]
})
export class AssetsComponent {
  @ViewChild("readOnlyTemplate", {static: false}) readOnlyTemplate: TemplateRef<any>|undefined;
  @ViewChild("editTemplate", {static: false}) editTemplate: TemplateRef<any>|undefined;
       
  editedAsset: Asset|null = null;
  assets: Array<Asset>;
  isNewRecord: boolean = false;
  statusMessage: string = "";
       
  constructor(private serv: AssetService) {
      this.assets = new Array<Asset>();
  }
       
  ngOnInit() {
      this.loadAssets();
  }
       
  //загрузка пользователей
  private loadAssets() {
      this.serv.getAssets().subscribe((data: Array<Asset>) => {
              this.assets = data; 
          });
  }
  // добавление пользователя
  addAsset() {
      this.editedAsset = new Asset("", "", "", "", "");
      this.assets.push(this.editedAsset);
      this.isNewRecord = true;
  }
    
  // редактирование пользователя
  editAsset(asset: Asset) {
      this.editedAsset = new Asset(asset._id, asset.urlImage, asset.urlAudio, asset.symbol, asset._word);
  }
  // загружаем один из двух шаблонов
  loadTemplate(asset: Asset) {
      if (this.editedAsset && this.editedAsset._id === asset._id) {
          return this.editTemplate;
      } else {
          return this.readOnlyTemplate;
      }
  }
  // сохраняем пользователя
  saveAsset() {
    console.log(this.editedAsset);
      if (this.isNewRecord) {
          // добавляем пользователя
          this.serv.createAsset(this.editedAsset as Asset).subscribe(_ => {
              this.statusMessage = "Данные успешно добавлены",
              this.loadAssets();
          });
          this.isNewRecord = false;
          this.editedAsset = null;
      } else {
          // изменяем пользователя
          this.serv.updateAsset(this.editedAsset as Asset).subscribe(_ => {
              this.statusMessage = "Данные успешно обновлены",
              this.loadAssets();
          });
          this.editedAsset = null;
      }
  }
  // отмена редактирования
  cancel() {
      // если отмена при добавлении, удаляем последнюю запись
      if (this.isNewRecord) {
          this.assets.pop();
          this.isNewRecord = false;
      }
      this.editedAsset = null;
  }
  // удаление пользователя
  deleteAsset(asset: Asset) {
      this.serv.deleteAsset(asset._id).subscribe(_ => {
          this.statusMessage = "Данные успешно удалены",
          this.loadAssets();
      });
  }
}

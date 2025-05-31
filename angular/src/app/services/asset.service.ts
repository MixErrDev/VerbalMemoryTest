import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Asset} from "../models/asset";
import { __param } from "tslib";
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AssetService{
    private url = "https://ey1shx-193-218-138-59.ru.tuna.am/api/assets";
    constructor(private http: HttpClient){ }
        
    getAssets(){
        return this.http.get<Array<Asset>>(this.url);
    }
    async getRandomAssets(count: number): Promise<Asset[]> {
        const data = await lastValueFrom(this.getAssets());
        console.log(data);
        return this.shuffle(data).slice(0, count);
    }
    getAsset(word: string){
        const myParams = new HttpParams().append('sword', word)
        return this.http.get<Asset>(this.url, { params: myParams });
    }
    createAsset(asset: Asset){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.post<Asset>(this.url, JSON.stringify(asset), {headers: myHeaders}); 
    }
    updateAsset(asset: Asset) {
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.put<Asset>(this.url, JSON.stringify(asset), {headers:myHeaders});
    }
    deleteAsset(id: string){
        return this.http.delete<Asset>(this.url + "/" + id);
    }
    private shuffle(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Asset } from "../models/asset";
import { __param } from "tslib";
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AssetService {
    private url = 'http://localhost/api/db-api.php';
    
    constructor(private http: HttpClient) { }
        
    getAssets() {
        return this.http.get<Array<Asset>>(`${this.url}?action=get_assets`);
    }

    async getRandomAssets(count: number): Promise<Asset[]> {
        const data = await lastValueFrom(this.getAssets());
        console.log(data);
        return this.shuffle(data).slice(0, count);
    }

    getAsset(word: string) {
        const params = new HttpParams().set('word', word);
        return this.http.get<Asset>(`${this.url}?action=get_assets`, { params });
    }

    createAsset(asset: Asset) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<Asset>(`${this.url}?action=create_asset`, asset, { headers });
    }

    updateAsset(asset: Asset) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put<Asset>(`${this.url}?action=update_asset`, asset, { headers });
    }

    deleteAsset(id: string) {
        return this.http.delete<Asset>(`${this.url}?action=delete_asset&id=${id}`);
    }

    private shuffle(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
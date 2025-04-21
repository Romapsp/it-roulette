import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { prize } from "../interfaces/prize.interface";
import { song } from "../interfaces/song.interface";


@Injectable({
    providedIn: 'root'
})


export class PrizeService {

    constructor(private http: HttpClient) { }

    private prizeUrl = 'fakeDB/PrizeDB.json';
    private songUrl = 'fakeDB/MelodyDB.json';

    getPrizes() {
        return this.http.get<prize[]>(this.prizeUrl);
    }

    getSongs() {
        return this.http.get<song[]>(this.songUrl);
    }

}

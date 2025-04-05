import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { prize } from "../interfaces/prize.interface";
import { melody } from "../interfaces/melody.interface";


@Injectable({
    providedIn: 'root'
})


export class PrizeService {

    constructor(private http: HttpClient) { }

    private prizeUrl = 'fakeDB/PrizeDB.json';
    private melodyUrl = 'fakeDB/MelodyDB.json';

    getPrizes() {
        return this.http.get<prize[]>(this.prizeUrl);
    }

    getMelodies() {
        return this.http.get<melody[]>(this.melodyUrl);
    }

}

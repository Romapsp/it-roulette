import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { prize } from "../interfaces/prize.interface";


@Injectable({
    providedIn: 'root'
})


export class PrizeService {

    constructor(private http: HttpClient) { }

    private prizeUrl = 'fakeDB/DB.json';

    getPrizes() {
        return this.http.get<prize[]>(this.prizeUrl);
    }

}

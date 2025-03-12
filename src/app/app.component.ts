import { Component, inject } from "@angular/core";
import { prize } from "./interfaces/prize.interface";
import { PrizeService } from "./servises/prizeServise";
import { PrizesFlexComponent } from "./components/prizes-flex/prizes-flex.component";
import { SpinButtonComponent } from "./components/spin-button/spin-button.component";
import { PrizesCodeComponent } from "./components/prizes-code/prizes-code.component";


@Component({
  selector: 'app-root',
  imports: [PrizesFlexComponent, SpinButtonComponent, PrizesCodeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Roulet';

  prizeServise: PrizeService = inject(PrizeService);
  prizes!: prize[];

  ngOnInit() {
    this.prizeServise.getPrizes().subscribe(data => {
      this.prizes = data
    });
  }
}



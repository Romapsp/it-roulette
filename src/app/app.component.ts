import { Component, inject } from "@angular/core";
import { PrizeService } from "./servises/prizeServise";
import { PrizesFlexComponent } from "./components/prizes-flex/prizes-flex.component";
import { SpinButtonComponent } from "./components/spin-button/spin-button.component";
import { PrizesCodeComponent } from "./components/prizes-code/prizes-code.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { prize } from "./interfaces/prize.interface";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PrizesFlexComponent,
    SpinButtonComponent,
    PrizesCodeComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Roulette';

  prizeService: PrizeService = inject(PrizeService);
  prizes!: prize[];

  private _designType: string = 'horizontal';

  ngOnInit() {
    this.prizeService.getPrizes().subscribe(data => {
      this.prizes = data;
    });
  }

  get designType(): string {
    return this._designType;
  }

  set designType(value: string) {
    this._designType = value;
  }

  spinButtoClick() {
    this.spinnig(3);
    setTimeout(() => this.stopOnCurrentPrize(), 5000);  // Остановка через 5 секунд
  }


  getPrizeIdUnderLine() {
    if (this._designType === 'horizontal') {
      const centerElement = document.elementFromPoint(window.innerWidth / 2, 135);
      return (centerElement?.id);
    }
    else {
      const centerElement = document.elementFromPoint(window.innerWidth / 2, 383);
      return (centerElement?.id);
    }
  }


  spinnig(speed: number) {
    const elements = document.querySelectorAll('.prizes-flex__wrapper');
    elements.forEach(el => el.classList.remove('animate-1', 'animate-2', 'animate-3', 'stop-animation'));

    const elementsVertical = document.querySelectorAll('.prize-list');
    elementsVertical.forEach(el => el.classList.remove('stop-animation'));


    switch (speed) {
      case 1:
        this.applyAnimation('animate-1', 'vertical-animate');
        break;
      case 2:
        this.applyAnimation('animate-2', 'vertical-animate');
        break;
      case 3:
        this.applyAnimation('animate-3', 'vertical-animate');
        break;
      default:
        this.applyAnimation('stop-animation', 'stop-animation');
        break;
    }
  }


  stopOnCurrentPrize() {
    this.applyAnimation('stop-animation', 'stop-animation');

    const prizeId = this.getPrizeIdUnderLine();
    if (!prizeId) return;

    console.log(`Рулетка остановилась на призе: ${prizeId}`);
  }



  private applyAnimation(horizontalClass: string, verticalClass: string) {
    const horizontalElements = document.querySelectorAll('.prizes-flex__wrapper');
    horizontalElements.forEach(el => el.classList.add(horizontalClass));

    const verticalElements = document.querySelectorAll('.prize-list');
    verticalElements.forEach(el => el.classList.add(verticalClass));
  }
}




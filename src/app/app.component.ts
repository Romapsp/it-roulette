import { Component, inject } from "@angular/core";
import { PrizeService } from "./servises/prizeServise";
import { PrizesFlexComponent } from "./components/prizes-flex/prizes-flex.component";
import { SpinButtonComponent } from "./components/spin-button/spin-button.component";
import { PrizesCodeComponent } from "./components/prizes-code/prizes-code.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { prize } from "./interfaces/prize.interface";
import { waitForAsync } from "@angular/core/testing";
import { melody } from "./interfaces/melody.interface";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PrizesFlexComponent,
    PrizesCodeComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Roulette';
  checkedPrizes?: checkedPrize[] = [];
  prizeService: PrizeService = inject(PrizeService);
  prizes!: prize[];
  prizeToShow?: prize[] = [];
  winnedPrize?: prize = undefined;
  soundWhileSpinning?: boolean = true;
  melodies: melody[] = [];
  private audio: HTMLAudioElement | null = null;
  clicable: boolean = true;
  animationSpeed: number = 0;


  ngOnInit() {
    this.prizeService.getPrizes().subscribe(data => {
      this.prizes = data;
      for (let i = 0; i < this.prizes.length; i++) {
        this.checkedPrizes?.push({ checked: true, prize: this.prizes[i] });
        this.prizeToShow?.push(this.prizes[i]);
      }
    });
    this.prizeService.getMelodies().subscribe(data => {
      this.melodies = data;
    });
  }


  prizeCheckStateInput(checkedPrize: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    checkedPrize.checked = inputElement.checked;
    this.updatePrizeCheckState()
  }


  updatePrizeCheckState() {
    this.prizeToShow = this.checkedPrizes?.filter(c => c.checked).map(c => c.prize) ?? [];
  }


  async spinButtonClick() {
    if (!this.clicable) return;
    this.updatePrizeCheckState();
    this.clicable = false;
    this.winnedPrize = this.getRandomPrize();
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
    if (this.soundWhileSpinning) this.playRandomMelody();
    this.animationSpeed = 3;
    await wait(3500);
    this.animationSpeed = 2;
    await wait(3500);
    this.animationSpeed = 1;
    await wait(3000);
    let curentprizeId = this.getPrizeIdUnderLine();
    while (this.winnedPrize.id != curentprizeId) {
      await wait(100);
      curentprizeId = this.getPrizeIdUnderLine();
    }
    this.animationSpeed = 0;
    this.stopMusic();
    this.prizeUncheck(this.winnedPrize.id.toString());
    this.clicable = true;
  }




  getPrizeIdUnderLine() {
    const line = document.querySelector('.vertical-line') as HTMLElement;
    line.style.visibility = 'hidden';
    const rect = line.getBoundingClientRect();
    const xInPixels = rect.left + rect.width * 0.495;
    const yInPixels = window.innerHeight * 0.13;
    const centerElement = document.elementFromPoint(xInPixels, yInPixels) as HTMLElement;
    line.style.visibility = 'visible';
    return Number(centerElement?.id);
  }


  playRandomMelody() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if (this.melodies.length === 0) {
      console.warn("Список мелодий пуст, не могу воспроизвести звук.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * this.melodies.length);
    const selectedMelody = this.melodies[randomIndex].path;
    this.melodies.splice(randomIndex, 1);
    this.audio = new Audio(selectedMelody);
    this.audio.loop = false;
    this.audio.play().catch(error => console.error('Ошибка при воспроизведении:', error));
  }


  stopMusic() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }


  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  trackById(index: number, item: checkedPrize): number {
    return item.prize.id;
  }


  prizeUncheck(prizeId: string) {
    if (!this.checkedPrizes) return;
    const prizeToUncheck = this.checkedPrizes.find(p => p.prize.id == Number(prizeId));
    if (prizeToUncheck) {
      prizeToUncheck.checked = false;
    }
  }

  getRandomPrize(): prize {
    const list = this.prizeToShow ?? [];
    return list[this.getRandomNumber(0, list.length - 1)];
  }


}
interface checkedPrize {
  checked: boolean,
  prize: prize
}


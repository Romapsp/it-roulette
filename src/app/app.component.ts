import { Component, inject } from "@angular/core";
import { PrizeService } from "./servises/prizeServise";
import { PrizesFlexComponent } from "./components/prizes-flex/prizes-flex.component";
import { SpinButtonComponent } from "./components/spin-button/spin-button.component";
import { PrizesCodeComponent } from "./components/prizes-code/prizes-code.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { prize } from "./interfaces/prize.interface";


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
  melodiesPaths: string[] = [
    'melodies/1.mp3', 'melodies/2.mp3', 'melodies/3.mp3', 'melodies/4.mp3',
    'melodies/5.mp3', 'melodies/6.mp3', 'melodies/7.mp3', 'melodies/8.mp3', 'melodies/9.mp3'
  ];
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
    this.winnedPrize = (this.prizeToShow ?? [])[this.getRandomNumber(0, (this.prizeToShow?.length ?? 0) - 1)];
    if (this.soundWhileSpinning) {
      this.playRandomMelody();
    }
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    this.animationSpeed = 3;
    await wait(4000);
    this.animationSpeed = 2;
    await wait(3000);
    this.animationSpeed = 1;
    await wait(2000);
    let flag = true;
    while (flag) {
      if (this.winnedPrize.id == parseInt(this.getPrizeIdUnderLine(), 10)) {
        this.animationSpeed = 0;
        console.log('wp: ' + this.winnedPrize.id);
        this.stopMusic();
        this.prizeUncheck(this.winnedPrize.id.toString());
        this.clicable = true;
        flag = false;
      }
      await wait(1);
    }
  }


  getPrizeIdUnderLine() {
    const line = document.querySelector('.vertical-line') as HTMLElement;
    line.style.visibility = 'hidden';
    const rect = line.getBoundingClientRect();
    const xInPixels = rect.left + rect.width * 0.495;
    const yInPixels = window.innerHeight * 0.13;
    const centerElement = document.elementFromPoint(xInPixels, yInPixels) as HTMLElement;
    line.style.visibility = 'visible';
    return centerElement?.id;
  }


  playRandomMelody() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if (this.melodiesPaths.length === 0) {
      console.warn("Список мелодий пуст, не могу воспроизвести звук.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * this.melodiesPaths.length);
    const selectedMelody = this.melodiesPaths[randomIndex];
    this.melodiesPaths.splice(randomIndex, 1);
    this.audio = new Audio(selectedMelody);
    this.audio.loop = true;
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


}
interface checkedPrize {
  checked: boolean,
  prize: prize
}
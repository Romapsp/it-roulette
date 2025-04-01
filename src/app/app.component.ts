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
    SpinButtonComponent,
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



  // Renamed to avoid duplicate function implementation
  prizeCheckStateInput(checkedPrize: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    checkedPrize.checked = inputElement.checked;
    this.updatePrizeCheckState()
  }

  updatePrizeCheckState() {
    this.prizeToShow = [];
    for (let i = 0; i < (this.checkedPrizes ?? []).length; i++) {
      if ((this.checkedPrizes ?? [])[i].checked) {
        this.prizeToShow.push((this.checkedPrizes ?? [])[i].prize);
      }
    }
  }

  spinButtonClick() {
    if (this.clicable) {
      this.updatePrizeCheckState();
      this.clicable = false;

      if (this.winnedPrize?.id) {
        this.checkedPrizes?.filter(c => c.prize.id == this.winnedPrize!.id)
          .forEach(c => c.checked = false);
      }

      this.winnedPrize = undefined;

      if (this.soundWhileSpinning) {
        this.playRandomMelody();
      }
      const delays = [3000, 2000, 1000].map(base => base + this.getRandomNumber(0, 2000));
      let maxAddedTime = 4;
      let addedTyme = maxAddedTime - this.getRandomNumber(0, 4);
      maxAddedTime -= addedTyme;
      this.animationSpeed = 3;

      setTimeout(() => {
        addedTyme = maxAddedTime - this.getRandomNumber(0, maxAddedTime);
        maxAddedTime -= addedTyme;
        this.animationSpeed = 2;

        setTimeout(() => {
          this.animationSpeed = 1;

          setTimeout(() => {
            this.animationSpeed = 0;
            this.stopMusic();
            setTimeout(() => {
              const prizeId = this.getPrizeIdUnderLine();
              if (prizeId) {
                const prizeToUncheck = this.checkedPrizes?.find(p => p.prize.id == Number(prizeId));
                if (prizeToUncheck) {
                  prizeToUncheck.checked = false;
                }
              }
              this.clicable = true;
            }, 1000);
          }, delays[2] + maxAddedTime);
        }, delays[1] + addedTyme);
      }, delays[0] + addedTyme);
    }
  }



  getPrizeIdUnderLine() {
    const line = document.querySelector('.vertical-line') as HTMLElement;
    const xInPixels = (window.innerWidth * 49.5) / 100;
    const yInPixels = (window.innerHeight * 13) / 100;
    line.style.zIndex = '-1';
    const centerElement = document.elementFromPoint(xInPixels, yInPixels) as HTMLElement;
    line.style.zIndex = '5';
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


}
interface checkedPrize {
  checked: boolean,
  prize: prize
}
import { Component, inject } from "@angular/core";
import { PrizeService } from "./servises/prizeServise";
import { PrizesFlexComponent } from "./components/prizes-flex/prizes-flex.component";
import { PrizesCodeComponent } from "./components/prizes-code/prizes-code.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { prize } from "./interfaces/prize.interface";
import { song } from "./interfaces/song.interface";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PrizesFlexComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'IT-Roulette';
  checkedPrizes?: checkedPrize[] = [];
  prizeService: PrizeService = inject(PrizeService);
  prizes!: prize[];
  prizeToShow?: prize[] = [];
  soundWhileSpinning?: boolean = true;
  songs: song[] = [];
  private audio: HTMLAudioElement | null = null;
  clicable: boolean = true;
  animationSpeed: number = 0;
  speedMultiplier: string = '7';
  duration: number = 0;
  spinningTime: number = 10;


  ngOnInit() {
    this.prizeService.getPrizes().subscribe(data => {
      this.prizes = data;
      for (let i = 0; i < this.prizes.length; i++) {
        this.checkedPrizes?.push({ checked: true, prize: this.prizes[i] });
        this.prizeToShow?.push(this.prizes[i]);
      }
    });
    this.prizeService.getSongs().subscribe(data => {
      this.songs = data;
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


  wait(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }


  async spinButtonClick() {
    if (!this.clicable) return;
    this.updatePrizeCheckState();
    this.clicable = false;
    if (this.soundWhileSpinning) this.playRandomSong();
    this.animationSpeed = 10 * Number(this.speedMultiplier) + this.getRandomNumber(0, 5) * Number(this.speedMultiplier);
    this.duration = this.spinningTime * 1000 + this.getRandomNumber(500, 1000);
    await this.wait(this.spinningTime * 1000 + 750);
    this.stopMusic();
    console.log(this.getPrizeIdUnderLine());
    if (this.getPrizeIdUnderLine() == '') {
      console.log('Пустой id приза, повторите попытку');
      this.animationSpeed = 0.3;
      this.duration = 2001;
      await this.wait(2001);
    }
    this.prizeUncheck(this.getPrizeIdUnderLine());
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
    return centerElement?.id;
  }


  playRandomSong() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if (this.songs.length === 0) {
      console.warn("Список мелодий пуст, не могу воспроизвести звук.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * this.songs.length);
    const selectedSong = this.songs[randomIndex].path;
    this.songs.splice(randomIndex, 1);
    this.audio = new Audio(selectedSong);
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
}


interface checkedPrize {
  checked: boolean,
  prize: prize
}


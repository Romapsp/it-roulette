import { Component, inject } from "@angular/core";
import { PrizeService } from "./servises/prizeServise";
import { PrizesFlexComponent } from "./components/prizes-flex/prizes-flex.component";
import { SpinButtonComponent } from "./components/spin-button/spin-button.component";
import { PrizesCodeComponent } from "./components/prizes-code/prizes-code.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { prize } from "./interfaces/prize.interface";
import { PrizeModalComponent } from "./components/prize-modal/prize-modal.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PrizesFlexComponent,
    SpinButtonComponent,
    PrizesCodeComponent,
    FormsModule,
    CommonModule,
    PrizeModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Roulette';

  prizeService: PrizeService = inject(PrizeService);
  prizes!: prize[];
  winnedPrize?: prize = undefined;
  spinningTime: number = 3;
  modalOpen = false;
  soundWhileSpinning?: boolean = false;
  private _designType: string = 'horizontal';
  melodiesPaths: string[] = ['melodies/1.mp3', 'melodies/2.mp3', 'melodies/3.mp3', 'melodies/4.mp3',
    'melodies/5.mp3', 'melodies/6.mp3', 'melodies/7.mp3', 'melodies/8.mp3', 'melodies/9.mp3'];
  private audio: HTMLAudioElement | null = null;

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
    if (this.soundWhileSpinning) {
      this.playRandomMelody();
    }
    this.winnedPrize = undefined;
    this.spinnig(3);
    setTimeout(() => { this.stopOnCurrentPrize(); this.modalOpen = true; this.stopMusic(); }, this.spinningTime * 1000);
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
    else {
      this.winnedPrize = this.prizes.find(p => p.id == Number(prizeId));
    }
  }



  private applyAnimation(horizontalClass: string, verticalClass: string) {
    const horizontalElements = document.querySelectorAll('.prizes-flex__wrapper');
    horizontalElements.forEach(el => el.classList.add(horizontalClass));

    const verticalElements = document.querySelectorAll('.prize-list');
    verticalElements.forEach(el => el.classList.add(verticalClass));
  }

  closeModal() {
    if (this.winnedPrize) {
      const index = this.prizes.findIndex(p => p.id === this.winnedPrize?.id);
      if (index > -1) {
        this.prizes.splice(index, 1);
      }
    }
    this.winnedPrize = undefined;
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

    // Выбираем случайную мелодию
    const randomIndex = Math.floor(Math.random() * this.melodiesPaths.length);
    const selectedMelody = this.melodiesPaths[randomIndex];

    // Убираем выбранную мелодию из списка, чтобы не повторялась до полного проигрывания всех
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

}




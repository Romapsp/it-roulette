import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';
import { PrizeComponent } from "../prize/prize.component";
import { CommonModule } from '@angular/common';
import { servise } from '../../interfaces/srvise.interface';

@Component({
  selector: 'app-prizes-flex',
  standalone: true,
  imports: [PrizeComponent, CommonModule],
  templateUrl: './prizes-flex.component.html',
  styleUrls: ['./prizes-flex.component.css'] // Исправлено на styleUrls, а не styleUrl
})
export class PrizesFlexComponent implements OnChanges {
  @Input() prizes!: prize[];
  @Input() flexDirection?: string = 'horizontal';
  @Input() animationSpeed: number = 0;
  serviseArr: servise[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.prizes && this.prizes.length > 0) { // Добавлена проверка на undefined
      this.serviseArr = [];
      const numServises = Math.ceil(40 / this.prizes.length); // Для создания массива сервисов на основе количества призов
      for (let i = 0; i < numServises; i++) {
        this.serviseArr.push({ id: i });
      }
    }
    this.spinning(this.animationSpeed); // Вызов метода spinning с текущей скоростью анимации
  }

  spinning(speed: number) {
    const elements = document.querySelectorAll('.prizes-flex__wrapper');
    const elementsVertical = document.querySelectorAll('.prize-list');
    switch (speed) {
      case 1:
        elements.forEach(el => el.classList.remove('animate-1', 'animate-2', 'animate-3', 'stop-animation'));
        this.applyAnimation('animate-1', 'vertical-animate');
        break;
      case 2:
        elements.forEach(el => el.classList.remove('animate-1', 'animate-2', 'animate-3', 'stop-animation'));
        this.applyAnimation('animate-2', 'vertical-animate');
        break;
      case 3:
        elements.forEach(el => el.classList.remove('animate-1', 'animate-2', 'animate-3', 'stop-animation'));
        this.applyAnimation('animate-3', 'vertical-animate');
        break;
      default:
        this.applyAnimation('stop-animation', 'stop-animation');
        break;
    }
  }

  private applyAnimation(horizontalClass: string, verticalClass: string) {
    const horizontalElements = document.querySelectorAll('.prizes-flex__wrapper');
    horizontalElements.forEach(el => el.classList.add(horizontalClass));
    const verticalElements = document.querySelectorAll('.prize-list');
    verticalElements.forEach(el => el.classList.add(verticalClass));
  }
}

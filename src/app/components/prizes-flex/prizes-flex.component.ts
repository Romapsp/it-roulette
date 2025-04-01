import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';
import { PrizeComponent } from "../prize/prize.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prizes-flex',
  standalone: true,
  imports: [PrizeComponent, CommonModule],
  templateUrl: './prizes-flex.component.html',
  styleUrls: ['./prizes-flex.component.css']
})
export class PrizesFlexComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() prizes!: prize[];
  @Input() animationSpeed: number = 1;
  @ViewChild('wrapper', { static: false }) wrapperRef!: ElementRef<HTMLDivElement>;
  prizesForList: prizeForList[] = [];
  private animationFrameId: number | null = null;
  private currentX: number = 0;
  private speedMap = { 1: 10, 2: 25, 3: 50 }; // Разные скорости прокрутки
  private container: HTMLElement | null = null;

  flag: boolean = true;

  ngAfterViewInit(): void {
    this.container = this.wrapperRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animationSpeed']) {
      this.stopAnimation();
      this.startAnimation(this.animationSpeed);
    }
    if (changes['prizes'] && Array.isArray(this.prizes)) {
      this.prizesForList = this.prizes.map((prize, index) => ({ id: index, prize }));
      this.fillContainer();
    }
  }


  // Старт анимации
  startAnimation(speed: number) {
    this.fillContainer();
    if (!this.container) return;

    const move = () => {
      if (!this.container) return;

      // Прокручиваем элементы влево
      this.currentX -= this.speedMap[speed as keyof typeof this.speedMap];

      // Когда элементы уходят за пределы контейнера, сбрасываем позицию
      if (Math.abs(this.currentX) >= this.container.scrollWidth / 2) {
        this.currentX = 0;
        this.moveElementsToStart(); // Перемещаем элементы обратно в начало
      }

      this.container.style.transform = `translateX(${this.currentX}px)`;

      // Запускаем анимацию на следующем кадре
      this.animationFrameId = requestAnimationFrame(move);
    };

    if (speed > 0) {
      this.animationFrameId = requestAnimationFrame(move);
    }
  }

  // Останавливаем анимацию
  stopAnimation() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Заполнение контейнера элементами для бесконечной прокрутки
  fillContainer() {

    const containerWidth = this.container?.offsetWidth || 0;
    const itemWidth = this.container?.firstElementChild?.clientWidth || 0;

    if (itemWidth === 0 || containerWidth === 0 || this.prizesForList.length === 0) return;

    // Определяем сколько элементов нужно, чтобы заполнить контейнер
    const numberOfElementsToFill = 9;

    // Дублируем элементы для бесконечной прокрутки
    const items = this.prizesForList.slice();
    while (this.prizesForList.length < 2000) {
      this.prizesForList.push(...items); // Добавляем элементы в конец
    }

  }

  // Перемещение элементов в начало ленты, когда они уходят за пределы
  moveElementsToStart() {
    if (this.prizesForList.length > 1) {
      const firstElement = this.prizesForList.shift();
      if (firstElement) {
        this.prizesForList.push(firstElement); // Перемещаем первый элемент в конец
      }
    }
  }

  ngOnDestroy() {
    this.stopAnimation();
  }

  trackByFn(index: number, prize: prizeForList): number {
    return prize.id;
  }
}

interface prizeForList {
  id: number;
  prize: prize;
}

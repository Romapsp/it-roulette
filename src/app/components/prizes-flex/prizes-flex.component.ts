import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';

interface prizeForList {
  id: number;
  prize: prize;
}
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
  @Input() animationSpeed: number = 0;

  @ViewChild('wrapper', { static: false }) wrapperRef!: ElementRef<HTMLDivElement>;

  prizesForList: prizeForList[] = [];
  private animationFrameId: number | null = null;
  private currentX: number = 0;
  private speedMap = { 0: 0, 1: 5, 2: 50, 3: 75 };
  private container: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.container = this.wrapperRef.nativeElement;
    this.initAnimation(); // безопасный запуск
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prizes'] || changes['animationSpeed']) {
      this.initAnimation(); // перезапуск при изменениях
    }
  }

  private initAnimation() {
    this.stopAnimation(); // защита от дубликатов

    if (!this.container || !this.prizes?.length) return;

    this.fillContainer(); // заполняем prizesForList
    this.startAnimation(this.animationSpeed); // запускаем с нужной скоростью
  }

  private startAnimation(speed: number) {
    const containerWidth = this.container!.scrollWidth / 2;

    const move = () => {
      if (!this.container) return;

      this.currentX -= this.speedMap[speed as keyof typeof this.speedMap];

      if (Math.abs(this.currentX) >= containerWidth) {
        this.currentX = 0;
      }

      this.container.style.transform = `translateX(${this.currentX}px)`;
      this.animationFrameId = requestAnimationFrame(move);
    };

    this.animationFrameId = requestAnimationFrame(move);
  }

  private stopAnimation() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private fillContainer() {
    const original = this.prizes.map((prize, index) => ({ id: index, prize }));
    this.prizesForList = [];

    const minTotalItems = 50;

    while (this.prizesForList.length < minTotalItems) {
      const duplicated = original.map((p, i) => ({
        id: this.prizesForList.length + i,
        prize: p.prize
      }));
      this.prizesForList.push(...duplicated);
    }
  }

  ngOnDestroy() {
    this.stopAnimation();
  }

  trackByFn(index: number, prize: prizeForList): number {
    return prize.id;
  }
}


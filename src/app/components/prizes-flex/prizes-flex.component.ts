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
  private speedMap = { 1: 10, 2: 25, 3: 50 };
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


  startAnimation(speed: number) {
    this.fillContainer();
    if (!this.container) return;
    const move = () => {
      if (!this.container) return;
      this.currentX -= this.speedMap[speed as keyof typeof this.speedMap];
      if (Math.abs(this.currentX) >= this.container.scrollWidth / 2) {
        this.currentX = 0;
        this.moveElementsToStart();
      }
      this.container.style.transform = `translateX(${this.currentX}px)`;
      this.animationFrameId = requestAnimationFrame(move);
    };
    if (speed > 0) {
      this.animationFrameId = requestAnimationFrame(move);
    }
  }


  stopAnimation() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }


  fillContainer() {
    const containerWidth = this.container?.offsetWidth || 0;
    const itemWidth = this.container?.firstElementChild?.clientWidth || 0;
    if (itemWidth === 0 || containerWidth === 0 || this.prizesForList.length === 0) return;
    const numberOfElementsToFill = 9;
    const items = this.prizesForList.slice();
    while (this.prizesForList.length < 3000) {
      this.prizesForList.push(...items);
    }
  }


  moveElementsToStart() {
    if (this.prizesForList.length > 1) {
      const firstElement = this.prizesForList.shift();
      if (firstElement) {
        this.prizesForList.push(firstElement);
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

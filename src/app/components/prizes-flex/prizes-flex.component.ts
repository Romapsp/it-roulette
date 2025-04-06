import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
  @Input() animationSpeed: number = 0;
  @Input() duration: number = 0;
  @ViewChild('wrapper', { static: false }) wrapperRef!: ElementRef<HTMLDivElement>;
  prizesForList: prizeForList[] = [];
  private animationFrameId: number | null = null;
  private container: HTMLElement | null = null;


  constructor(private cdr: ChangeDetectorRef) { }


  ngAfterViewInit(): void {
    this.container = this.wrapperRef.nativeElement;
    this.initAnimation();
    this.cdr.detectChanges()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['prizes'] || changes['animationSpeed']) && this.wrapperRef) {
      this.initAnimation();
    }
  }


  private initAnimation() {
    this.stopAnimation();
    if (!this.container || !this.prizes?.length) return;
    this.fillContainer();
    this.startAnimation(this.animationSpeed, this.duration);
  }


  private startAnimation(speed: number, duration: number) {
    console.log('startAnimation', speed, duration);
    if (!this.wrapperRef || speed === 0 || duration <= 2000) return;
    const wrapper = this.wrapperRef.nativeElement;
    const startTime = performance.now();
    const initialSpeed = speed;
    const minSpeed = 2;
    const fadeDuration = duration - 2000;
    const totalDuration = duration;
    const move = () => {
      const elapsedTime = performance.now() - startTime;
      let currentSpeed = 0;
      if (elapsedTime < fadeDuration) {
        const progress = elapsedTime / fadeDuration;
        const eased = 1 - Math.pow(1 - progress, 3);
        currentSpeed = initialSpeed - (initialSpeed - minSpeed) * eased;
      } else if (elapsedTime < totalDuration) {
        currentSpeed = minSpeed;
      } else {
        this.stopAnimation();
        return;
      }
      wrapper.scrollLeft += currentSpeed;
      if (wrapper.scrollLeft >= wrapper.scrollWidth / 2) {
        wrapper.scrollLeft = 0;
      }
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
    const duplicate = original.map((p, i) => ({
      id: original.length + i,
      prize: p.prize
    }));
    this.prizesForList = [...original];
    while (this.prizesForList.length < 500) {
      this.prizesForList.push(...duplicate);
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

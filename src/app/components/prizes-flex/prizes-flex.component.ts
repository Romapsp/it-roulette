import { Component, Input } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';
import { PrizeComponent } from "../prize/prize.component";
import { CommonModule } from '@angular/common';
import { servise } from '../../interfaces/srvise.interface';

@Component({
  selector: 'app-prizes-flex',
  imports: [PrizeComponent, CommonModule],
  templateUrl: './prizes-flex.component.html',
  styleUrl: './prizes-flex.component.css'
})
export class PrizesFlexComponent {
  @Input() prizes!: prize[];
  @Input() flexDirection?: string = 'horizontal';
  serviseArr: servise[] = [];

  ngOnChanges() {
    for (let i = 0; i < Math.ceil(30 / this.prizes.length); i++) {
      this.serviseArr.push({ id: i });
    }
  }

}

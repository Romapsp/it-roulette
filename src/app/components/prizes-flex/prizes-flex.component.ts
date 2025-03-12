import { Component, Input } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';
import { PrizeComponent } from "../prize/prize.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prizes-flex',
  imports: [PrizeComponent, CommonModule],
  templateUrl: './prizes-flex.component.html',
  styleUrl: './prizes-flex.component.css'
})
export class PrizesFlexComponent {
  @Input() prizes!: prize[];
  @Input() flexDirection?: string = 'horizontal';  
}

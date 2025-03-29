import { Component, inject, Input } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';

@Component({
  selector: 'app-prize',
  imports: [],

  templateUrl: './prize.component.html',
  styleUrl: './prize.component.css'
})
export class PrizeComponent {
  @Input() prize!: prize;  
}


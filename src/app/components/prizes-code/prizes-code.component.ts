import { Component, Input } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';

@Component({
  selector: 'app-prizes-code',
  imports: [],
  templateUrl: './prizes-code.component.html',
  styleUrl: './prizes-code.component.css'
})
export class PrizesCodeComponent {
  @Input() prizes!: prize[];

}

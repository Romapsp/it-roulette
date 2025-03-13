import { Component, Input, Output, EventEmitter } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';

@Component({
  selector: 'app-prize-modal',
  templateUrl: './prize-modal.component.html',
  styleUrls: ['./prize-modal.component.css']
})
export class PrizeModalComponent {
  @Input() prize!: prize;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
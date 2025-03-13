import { Component, Input, Output, EventEmitter } from '@angular/core';
import { prize } from '../../interfaces/prize.interface';

@Component({
  selector: 'app-prize-modal',
  templateUrl: './prize-modal.component.html',
  styleUrls: ['./prize-modal.component.css']
})
export class PrizeModalComponent {
  @Input() prize!: prize; // Получаем приз как входной параметр
  @Output() close = new EventEmitter<void>(); // Событие для закрытия модального окна

  // Метод для закрытия модального окна
  closeModal() {
    this.close.emit();
  }
}
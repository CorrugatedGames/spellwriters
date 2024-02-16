import { Component, input } from '@angular/core';
import { type TileStatus } from '../../../interfaces';

@Component({
  selector: 'sw-tile-status-card',
  templateUrl: './tile-status-card.component.html',
  styleUrl: './tile-status-card.component.scss',
})
export class TileStatusCardComponent {
  public tileStatus = input.required<TileStatus>();

  public get formattedDescription() {
    return this.tileStatus().description;
  }
}

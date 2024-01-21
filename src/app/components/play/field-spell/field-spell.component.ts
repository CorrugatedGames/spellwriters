import { Component, Input } from '@angular/core';
import { FieldSpell } from '../../../interfaces';

@Component({
  selector: 'sw-field-spell',
  template: `
    <div
      class="field-spell"
      [class.casting]="isCasting"
      [class.origin-player]="spell.caster === 0"
      [class.origin-opponent]="spell.caster === 1"
    >
      <sw-spell-sprite
        class="background sprite"
        [sprite]="spell.sprite"
      ></sw-spell-sprite>

      <div class="info-container">
        <div class="direction"></div>

        <div class="stats">
          <div *ngIf="isCasting" class="stat cast-time">
            <div class="background spinner-border"></div>

            <span class="stat-badge badge rounded-pill">
              {{ spell.castTime }}
            </span>
          </div>

          <div *ngIf="!isCasting" class="stat speed">
            <span class="stat-badge badge rounded-pill">
              {{ spell.speed }}
            </span>
          </div>

          <div *ngIf="!isCasting" class="stat damage">
            <sw-icon
              class="background damage-icon"
              category="stat"
              name="damage"
              [size]="40"
            ></sw-icon>

            <span class="stat-badge badge rounded-pill">
              {{ spell.damage }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
  :host {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .field-spell {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    isolation: isolate;

    &.casting {
      .sprite {
        opacity: 0.5;
      }
    }

    &.origin-player {      
      .direction {
        border: 5px solid var(--color-player);
        border-bottom: none;
      }
    }

    &.origin-opponent {
      .info-container {
        flex-direction: column-reverse;

        .direction {
          border: 5px solid var(--color-opponent);
          border-top: none;
        }
      }
    }

    .info-container {
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .direction {
        height: 50%;
      }

      .stats {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 8px;

        .stat {
          .stat-badge {
            min-width: 24px;
            min-height: 24px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
          }

          &.cast-time {
            position: relative;
            
            .spinner-border {
              position: absolute;
              left: -4px;
              top: -4px;
              color: var(--stat-casttime);
            }

            .stat-badge {
              background: var(--stat-casttime);
            }
          }

          &.speed {
            border: 2px dashed var(--stat-speed);
            border-radius: 50%;

            .stat-badge {
              background: var(--stat-speed);
            }
          }

          &.damage {
            position: relative;

            .damage-icon {
              position: absolute;
              left: -8px;
              top: -8px;
            }
            
            .stat-badge {
              background: var(--stat-damage);
            }
          }
        }
      }
    }
  }

  `,
})
export class FieldSpellComponent {
  @Input({ required: true }) public spell!: FieldSpell;

  public get isCasting() {
    return this.spell.castTime > 0;
  }
}

import { Component } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-test-run',
  templateUrl: './test-run.component.html',
  styleUrl: './test-run.component.scss',
})
export class DebugTestRunComponent {
  @LocalStorage()
  public playerTestCharacterId!: string;

  @LocalStorage()
  public enemyTestCharacterId!: string;

  constructor(public contentService: ContentService) {}

  startTestRun() {}
}

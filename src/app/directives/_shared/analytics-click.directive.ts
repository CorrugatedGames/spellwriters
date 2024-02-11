import { Directive, HostListener, input } from '@angular/core';
import { type AnalyticsService } from '../../services/analytics.service';

@Directive({
  selector: '[swAnalyticsClick]',
})
export class AnalyticsClickDirective {
  public swAnalyticsClick = input.required<string>();
  public swAnalyticsClickValue = input<number>(1);

  constructor(private analyticsService: AnalyticsService) {}

  @HostListener('click', ['$event'])
  click() {
    this.analyticsService.sendDesignEvent(
      this.swAnalyticsClick(),
      this.swAnalyticsClickValue(),
    );
  }
}

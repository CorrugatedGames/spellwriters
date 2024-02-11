import { Directive, HostListener, inject, input } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Directive({
  selector: '[swAnalyticsClick]',
})
export class AnalyticsClickDirective {
  private analyticsService = inject(AnalyticsService);

  public swAnalyticsClick = input.required<string>();
  public swAnalyticsClickValue = input<number>(1);

  @HostListener('click', ['$event'])
  click() {
    this.analyticsService.sendDesignEvent(
      this.swAnalyticsClick(),
      this.swAnalyticsClickValue(),
    );
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StatCardComponent } from '../stat-card/stat-card.component';
import { DashboardIndicator } from '../../models/olympic.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title = '';
  @Input() indicators: DashboardIndicator[] = [];
}
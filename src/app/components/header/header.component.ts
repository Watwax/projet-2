import { Component, Input } from '@angular/core';

import { DashboardIndicator } from '../../models/olympic.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title = '';
  @Input() indicators: DashboardIndicator[] = [];
}
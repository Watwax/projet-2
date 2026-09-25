import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent implements OnInit {
  @Input() label = '';
  @Input() value: string | number = 0;

  ngOnInit(): void {
    if (this.value === null || this.value === undefined || this.value === '' || (typeof this.value === 'number' && isNaN(this.value))) {
      this.value = 'N/A';
    }
  }
}

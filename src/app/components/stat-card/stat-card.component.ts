import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent implements OnInit {
  @Input() label = '';
  @Input() value: string | number | null | undefined = 0;

  ngOnInit(): void {
    if (
      this.value === null ||
      this.value === undefined ||
      this.value === '' ||
      (typeof this.value === 'number' && Number.isNaN(this.value))
    ) {
      this.value = 'N/A';
    }
  }

  get displayValue(): string | number {
    return this.value ?? 'N/A';
  }
}

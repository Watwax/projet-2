import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-medal-chart',
  templateUrl: './medal-chart.component.html',
  styleUrls: ['./medal-chart.component.scss'],
})
export class MedalChartComponent implements OnChanges, OnDestroy {
  @Input() chartId = 'medal-chart';
  @Input() type: 'pie' | 'line' = 'pie';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Output() countrySelected = new EventEmitter<string>();

  private chart?: Chart<'pie' | 'line', number[], string>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labels'] || changes['data'] || changes['type']) {
      this.buildChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const isLineChart = this.type === 'line';

    this.chart = new Chart(this.chartId, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: [
          {
            label: isLineChart ? 'medals' : 'Medals',
            data: this.data,
            backgroundColor: isLineChart ? '#0b868f' : ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
            borderColor: isLineChart ? '#0b868f' : '#ffffff',
            borderWidth: isLineChart ? 3 : 1,
            pointBackgroundColor: '#0b868f',
            pointBorderColor: '#0b868f',
            pointRadius: isLineChart ? 4 : 3,
            pointHoverRadius: isLineChart ? 5 : 4,
            fill: false,
            tension: isLineChart ? 0.3 : 0,
            showLine: isLineChart,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        onClick: (event) => {
          if (this.type !== 'pie' || !event.native) {
            return;
          }

          const points = this.chart?.getElementsAtEventForMode(
            event.native,
            'point',
            { intersect: true },
            true
          );

          if (!points || points.length === 0) {
            return;
          }

          const index = points[0].index;
          const countryName = this.chart?.data.labels?.[index] ?? '';

          if (countryName) {
            this.countrySelected.emit(countryName);
          }
        },
      },
    });
  }
}

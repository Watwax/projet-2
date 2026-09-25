import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

import { OlympicCountry } from '../../models/olympic.model';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart<'pie', number[], string>;
  public totalCountries = 0;
  public totalJOs = 0;
  public error = '';
  public titlePage = 'Medals per Country';

  constructor(
    private readonly router: Router,
    private readonly olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.olympicService.getOlympicData().subscribe({
      next: (data: OlympicCountry[]) => {
        if (data.length > 0) {
          const allYears = data.flatMap((country: OlympicCountry) =>
            country.participations.map((participation) => participation.year)
          );

          this.totalJOs = new Set(allYears).size;
          this.totalCountries = data.length;

          const medalsByCountry = data.map((country: OlympicCountry) =>
            country.participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
          );

          this.buildPieChart(
            data.map((country: OlympicCountry) => country.country),
            medalsByCountry
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      },
    });
  }

  buildPieChart(countries: string[], medalsByCountry: number[]): void {
    const pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Medals',
            data: medalsByCountry,
            backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (event) => {
          if (event.native) {
            const points = pieChart.getElementsAtEventForMode(
              event.native,
              'point',
              { intersect: true },
              true
            );

            if (points.length > 0) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        },
      },
    });

    this.pieChart = pieChart;
  }
}


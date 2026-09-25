import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import { switchMap } from 'rxjs';

import { OlympicCountry } from '../../models/olympic.model';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public lineChart!: Chart<'line', number[], string>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const countryName = params.get('countryName');
          return this.olympicService.getCountryByName(countryName);
        })
      )
      .subscribe({
        next: (selectedCountry: OlympicCountry | undefined) => {
          if (!selectedCountry) {
            this.titlePage = 'Country not found';
            this.totalEntries = 0;
            this.totalMedals = 0;
            this.totalAthletes = 0;
            return;
          }

          this.titlePage = selectedCountry.country;
          const participations = selectedCountry.participations;

          this.totalEntries = participations.length;
          const years = participations.map((participation) => participation.year);
          const medals = participations.map((participation) => participation.medalsCount);

          this.totalMedals = medals.reduce((sum, medalCount) => sum + medalCount, 0);
          this.totalAthletes = participations.reduce(
            (sum, participation) => sum + participation.athleteCount,
            0
          );

          this.buildChart(years, medals);
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.message;
        },
      });
  }

  buildChart(years: number[], medals: number[]): void {
    this.lineChart = new Chart('countryChart', {
      type: 'line',
      data: {
        labels: years.map(String),
        datasets: [
          {
            label: 'medals',
            data: medals,
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}

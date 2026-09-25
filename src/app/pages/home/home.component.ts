import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OlympicCountry } from '../../models/olympic.model';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public totalCountries = 0;
  public totalJOs = 0;
  public error = '';
  public titlePage = 'Medals per Country';
  public labels: string[] = [];
  public chartData: number[] = [];

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
          this.labels = data.map((country: OlympicCountry) => country.country);
          this.chartData = data.map((country: OlympicCountry) =>
            country.participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      },
    });
  }

  onCountrySelected(countryName: string): void {
    this.router.navigate(['country', countryName]);
  }
}


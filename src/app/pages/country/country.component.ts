import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { OlympicCountry } from '../../models/olympic.model';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';
  public years: string[] = [];
  public medals: number[] = [];

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
            this.years = [];
            this.medals = [];
            return;
          }

          this.titlePage = selectedCountry.country;
          const participations = selectedCountry.participations;

          this.totalEntries = participations.length;
          this.years = participations.map((participation) => participation.year.toString());
          this.medals = participations.map((participation) => participation.medalsCount);

          this.totalMedals = this.medals.reduce((sum, medalCount) => sum + medalCount, 0);
          this.totalAthletes = participations.reduce(
            (sum, participation) => sum + participation.athleteCount,
            0
          );
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.message;
        },
      });
  }
}

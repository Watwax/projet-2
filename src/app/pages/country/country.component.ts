import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { CountrySummary } from '../../models/olympic.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit, OnDestroy {
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';
  public years: string[] = [];
  public medals: number[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const countryName = params.get('countryName');
          return this.dataService.getCountrySummary(countryName);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (summary: CountrySummary | undefined) => {
          if (!summary) {
            this.titlePage = 'Country not found';
            this.totalEntries = 0;
            this.totalMedals = 0;
            this.totalAthletes = 0;
            this.years = [];
            this.medals = [];
            return;
          }

          this.titlePage = summary.title;
          this.totalEntries = summary.totalEntries;
          this.totalMedals = summary.totalMedals;
          this.totalAthletes = summary.totalAthletes;
          this.years = summary.years;
          this.medals = summary.medals;
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.message;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

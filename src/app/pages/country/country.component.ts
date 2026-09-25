import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { CountrySummary, DashboardIndicator } from '../../models/olympic.model';
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
  public indicators: DashboardIndicator[] = [];
  public isLoading = true;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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
          this.isLoading = false;
          if (!summary) {
            this.router.navigate(['/not-found']);
            return;
          }

          this.titlePage = summary.title;
          this.totalEntries = summary.totalEntries;
          this.totalMedals = summary.totalMedals;
          this.totalAthletes = summary.totalAthletes;
          this.years = summary.years;
          this.medals = summary.medals;
          this.indicators = [
            { label: 'Participations', value: summary.totalEntries },
            { label: 'Medals', value: summary.totalMedals },
            { label: 'Athletes', value: summary.totalAthletes },
          ];
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.error = error.message;
        },
      });
  }

  get showChart(): boolean {
    return !this.isLoading && !this.error
      && this.years.length > 0 && this.medals.length > 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { DashboardIndicator, DashboardSummary } from '../../models/olympic.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public totalCountries = 0;
  public totalJOs = 0;
  public error = '';
  public titlePage = 'Medals per Country';
  public labels: string[] = [];
  public chartData: number[] = [];
  public indicators: DashboardIndicator[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService
      .getDashboardSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary: DashboardSummary) => {
          this.totalCountries = summary.totalCountries;
          this.totalJOs = summary.totalJOs;
          this.labels = summary.labels;
          this.chartData = summary.chartData;
          this.indicators = [
            { label: 'Number of countries', value: summary.totalCountries },
            { label: 'Number of Olympic Games', value: summary.totalJOs },
          ];
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

  onCountrySelected(countryName: string): void {
    this.router.navigate(['country', countryName]);
  }
}


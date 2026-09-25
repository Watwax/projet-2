import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardSummary } from '../../models/olympic.model';
import { DataService } from '../../services/data.service';

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
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.getDashboardSummary().subscribe({
      next: (summary: DashboardSummary) => {
        this.totalCountries = summary.totalCountries;
        this.totalJOs = summary.totalJOs;
        this.labels = summary.labels;
        this.chartData = summary.chartData;
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


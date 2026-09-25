import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  CountrySummary,
  DashboardSummary,
  OlympicCountry,
} from '../models/olympic.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly olympicUrl = './assets/mock/olympic.json';

  constructor(private readonly http: HttpClient) {}

  getOlympicData(): Observable<OlympicCountry[]> {
    return this.http.get<OlympicCountry[]>(this.olympicUrl);
  }

  getCountryByName(countryName: string | null): Observable<OlympicCountry | undefined> {
    return this.getOlympicData().pipe(
      map((countries: OlympicCountry[]) =>
        countries.find((country: OlympicCountry) => country.country === countryName)
      )
    );
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.getOlympicData().pipe(
      map((countries: OlympicCountry[]) => {
        const allYears = countries.flatMap((country: OlympicCountry) =>
          country.participations.map((participation) => participation.year)
        );

        const labels = countries.map((country: OlympicCountry) => country.country);
        const chartData = countries.map((country: OlympicCountry) =>
          country.participations.reduce(
            (sum, participation) => sum + participation.medalsCount,
            0
          )
        );

        return {
          totalCountries: countries.length,
          totalJOs: new Set(allYears).size,
          labels,
          chartData,
        };
      })
    );
  }

  getCountrySummary(countryName: string | null): Observable<CountrySummary | undefined> {
    return this.getCountryByName(countryName).pipe(
      map((country: OlympicCountry | undefined) => {
        if (!country) {
          return undefined;
        }

        const years = country.participations.map((participation) => participation.year.toString());
        const medals = country.participations.map((participation) => participation.medalsCount);

        return {
          title: country.country,
          totalEntries: country.participations.length,
          totalMedals: medals.reduce((sum, medalCount) => sum + medalCount, 0),
          totalAthletes: country.participations.reduce(
            (sum, participation) => sum + participation.athleteCount,
            0
          ),
          years,
          medals,
        };
      })
    );
  }
}

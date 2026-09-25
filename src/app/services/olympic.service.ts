import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { OlympicCountry } from '../models/olympic.model';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
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
}

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OlympicCountry } from '../models/olympic.model';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpTestingController: HttpTestingController;

  const countries: OlympicCountry[] = [
    {
      country: 'France',
      participations: [
        { year: 2012, medalsCount: 10, athleteCount: 20 },
        { year: 2016, medalsCount: 12, athleteCount: 22 },
      ],
    },
    {
      country: 'Canada',
      participations: [
        { year: 2012, medalsCount: 8, athleteCount: 15 },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should load the Olympic data from the mock endpoint', () => {
    service.getOlympicData().subscribe((result) => {
      expect(result).toEqual(countries);
    });

    const request = httpTestingController.expectOne('./assets/mock/olympic.json');
    expect(request.request.method).toBe('GET');
    request.flush(countries);
  });

  it('should find a country by name', () => {
    service.getCountryByName('France').subscribe((result) => {
      expect(result).toEqual(countries[0]);
    });

    httpTestingController.expectOne('./assets/mock/olympic.json').flush(countries);
  });

  it('should return no country for an unknown name', () => {
    service.getCountryByName('Japan').subscribe((result) => {
      expect(result).toBeUndefined();
    });

    httpTestingController.expectOne('./assets/mock/olympic.json').flush(countries);
  });

  it('should build the dashboard summary', () => {
    service.getDashboardSummary().subscribe((result) => {
      expect(result).toEqual({
        totalCountries: 2,
        totalJOs: 2,
        labels: ['France', 'Canada'],
        chartData: [22, 8],
      });
    });

    httpTestingController.expectOne('./assets/mock/olympic.json').flush(countries);
  });

  it('should build a country summary', () => {
    service.getCountrySummary('France').subscribe((result) => {
      expect(result).toEqual({
        title: 'France',
        totalEntries: 2,
        totalMedals: 22,
        totalAthletes: 42,
        years: ['2012', '2016'],
        medals: [10, 12],
      });
    });

    httpTestingController.expectOne('./assets/mock/olympic.json').flush(countries);
  });
});
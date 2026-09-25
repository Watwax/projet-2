import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { CountrySummary } from '../../models/olympic.model';
import { DataService } from '../../services/data.service';
import { CountryComponent } from './country.component';

describe('DetailComponent', () => {
  let component: CountryComponent;
  let route: ActivatedRoute;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    route = {
      paramMap: of(convertToParamMap({ countryName: 'France' })),
    } as ActivatedRoute;
    dataService = jasmine.createSpyObj<DataService>('DataService', [
      'getCountrySummary',
    ]);
    component = new CountryComponent(route, dataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the selected country summary', () => {
    const summary: CountrySummary = {
      title: 'France',
      totalEntries: 2,
      totalMedals: 22,
      totalAthletes: 42,
      years: ['2012', '2016'],
      medals: [10, 12],
    };
    dataService.getCountrySummary.and.returnValue(of(summary));

    component.ngOnInit();

    expect(dataService.getCountrySummary).toHaveBeenCalledWith('France');
    expect(component.titlePage).toBe('France');
    expect(component.totalEntries).toBe(2);
    expect(component.totalMedals).toBe(22);
    expect(component.totalAthletes).toBe(42);
    expect(component.years).toEqual(['2012', '2016']);
    expect(component.medals).toEqual([10, 12]);
  });

  it('should display a not found state when the service returns no summary', () => {
    dataService.getCountrySummary.and.returnValue(of(undefined));

    component.ngOnInit();

    expect(component.titlePage).toBe('Country not found');
    expect(component.totalEntries).toBe(0);
    expect(component.totalMedals).toBe(0);
    expect(component.totalAthletes).toBe(0);
  });

  it('should expose a service error', () => {
    dataService.getCountrySummary.and.returnValue(
      throwError(() => new Error('Unable to load country'))
    );

    component.ngOnInit();

    expect(component.error).toBe('Unable to load country');
  });

  it('should stop receiving route data after destruction', () => {
    const routeSubject = new Subject<ReturnType<typeof convertToParamMap>>();
    route = { paramMap: routeSubject.asObservable() } as ActivatedRoute;
    dataService.getCountrySummary.and.returnValue(of(undefined));
    component = new CountryComponent(route, dataService);

    component.ngOnInit();
    component.ngOnDestroy();
    routeSubject.next(convertToParamMap({ countryName: 'Canada' }));

    expect(dataService.getCountrySummary).not.toHaveBeenCalled();
  });
});

import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { DashboardSummary } from '../../models/olympic.model';
import { DataService } from '../../services/data.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let router: jasmine.SpyObj<Router>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    dataService = jasmine.createSpyObj<DataService>('DataService', [
      'getDashboardSummary',
    ]);
    component = new HomeComponent(router, dataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the dashboard summary returned by the service', () => {
    const summary: DashboardSummary = {
      totalCountries: 2,
      totalJOs: 4,
      labels: ['France', 'Canada'],
      chartData: [22, 8],
    };
    dataService.getDashboardSummary.and.returnValue(of(summary));

    component.ngOnInit();

    expect(component.totalCountries).toBe(2);
    expect(component.totalJOs).toBe(4);
    expect(component.labels).toEqual(['France', 'Canada']);
    expect(component.chartData).toEqual([22, 8]);
  });

  it('should expose a service error', () => {
    dataService.getDashboardSummary.and.returnValue(
      throwError(() => new Error('Unable to load dashboard'))
    );

    component.ngOnInit();

    expect(component.error).toBe('Unable to load dashboard');
  });

  it('should navigate to the selected country', () => {
    component.onCountrySelected('France');

    expect(router.navigate).toHaveBeenCalledWith(['country', 'France']);
  });

  it('should stop receiving values after destruction', () => {
    const summarySubject = new Subject<DashboardSummary>();
    dataService.getDashboardSummary.and.returnValue(summarySubject.asObservable());

    component.ngOnInit();
    component.ngOnDestroy();
    summarySubject.next({
      totalCountries: 3,
      totalJOs: 5,
      labels: ['Italy'],
      chartData: [15],
    });

    expect(component.totalCountries).toBe(0);
    expect(component.totalJOs).toBe(0);
  });
});

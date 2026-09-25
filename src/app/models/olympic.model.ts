export interface Participation {
  year: number;
  medalsCount: number;
  athleteCount: number;
}

export interface OlympicCountry {
  country: string;
  participations: Participation[];
}

export interface DashboardSummary {
  totalCountries: number;
  totalJOs: number;
  labels: string[];
  chartData: number[];
}

export interface CountrySummary {
  title: string;
  totalEntries: number;
  totalMedals: number;
  totalAthletes: number;
  years: string[];
  medals: number[];
}

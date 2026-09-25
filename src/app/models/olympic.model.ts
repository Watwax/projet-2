export interface Participation {
  year: number;
  medalsCount: number;
  athleteCount: number;
}

export interface OlympicCountry {
  country: string;
  participations: Participation[];
}

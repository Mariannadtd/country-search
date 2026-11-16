export interface RawLanguage {
  readonly name: string;
}

export interface RawCurrency {
  readonly name: string;
}

export interface RawCountry {
  readonly name: string;
  readonly capital?: string;
  readonly region?: string;
  readonly population?: number;
  readonly area?: number;
  readonly flags?: {
    readonly svg?: string;
    readonly png?: string;
  };
  readonly languages?: readonly RawLanguage[];
  readonly currencies?: readonly RawCurrency[];
  readonly borders?: readonly string[];
}

export interface Country {
  readonly name: string;
  readonly capital: string;
  readonly region: string;
  readonly population: number;
  readonly area: number;
  readonly flagUrl: string;
  readonly languages: string[];
  readonly currencies: string[];
  readonly borders: string[];
}

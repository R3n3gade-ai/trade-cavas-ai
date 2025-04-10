// Types for gamma exposure analysis
export interface StrikeExposure {
  strike: number;
  call_gamma: number;
  put_gamma: number;
  net_gamma: number;
  call_gamma_notional: number;
  put_gamma_notional: number;
  net_gamma_notional: number;
  call_delta: number;
  put_delta: number;
  net_delta: number;
  call_open_interest: number;
  put_open_interest: number;
  total_open_interest: number;
}

export interface PriceLevel {
  price: number;
  call_gamma: number;
  put_gamma: number;
  net_gamma: number;
  total_gamma: number;
  total_delta: number;
}

export interface GammaMetrics {
  net_gamma: number;
  net_gamma_notional: number;
  gamma_notional_1pct: number;
  net_delta: number;
  put_call_ratio: number;
  zero_gamma_price: number | null;
  largest_gamma_strike: number;
}

export interface DetailedGammaExposureResponse {
  symbol: string;
  current_price: number;
  analysis_by_strike: StrikeExposure[];
  exposure_curve: PriceLevel[];
  metrics: GammaMetrics | null;
}

// Types for options data
export interface OptionContract {
  id: string;
  symbol: string;
  name: string;
  strike: number;
  expirationDate: string;
  contractType: 'call' | 'put';
  lastPrice: number;
  change: number;
  bidPrice: number;
  askPrice: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  inTheMoney: boolean;
  updated?: number;
}

export interface OptionsChain {
  [expiration: string]: {
    calls: { [strike: string]: OptionContract };
    puts: { [strike: string]: OptionContract };
  };
}

// Types for options flow data
export interface FlowItem {
  time: string;
  ticker: string;
  expiry: string;
  callPut: string;
  spot: string;
  strike: string;
  otm: string;
  price: string;
  size: number;
  openInterest: string;
  impliedVol: string;
  type: string;
  premium: string;
  sector: string;
  heatScore: number;
}

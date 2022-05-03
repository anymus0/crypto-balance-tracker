// CoinGecko fetch models

interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

export interface CryptocurrencyDataCoinGecko {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply?: number;
  max_supply?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: Date;
  atl: number;
  atl_change_percentage: number;
  atl_date: Date;
  roi: Roi;
  last_updated: Date;
}

export interface CryptocurrencyDataCoinGeckoResponse {
  success: boolean;
  result: CryptocurrencyDataCoinGecko;
}

// DEX fetch models

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
}

interface QuoteToken {
  symbol: string;
}

interface H24 {
  buys: number;
  sells: number;
}

interface H6 {
  buys: number;
  sells: number;
}

interface H1 {
  buys: number;
  sells: number;
}

interface M5 {
  buys: number;
  sells: number;
}

interface Txns {
  h24: H24;
  h6: H6;
  h1: H1;
  m5: M5;
}

interface Volume {
  h24: number;
  h6: number;
  h1: number;
  m5: number;
}

interface PriceChange {
  h24: number;
  h6: number;
  h1: number;
  m5: number;
}

interface Liquidity {
  usd: number;
  base: number;
  quote: number;
}

interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: BaseToken;
  quoteToken: QuoteToken;
  priceNative: string;
  priceUsd: string;
  txns: Txns;
  volume: Volume;
  priceChange: PriceChange;
  liquidity: Liquidity;
  fdv: number;
  pairCreatedAt: any;
}

export interface CryptocurrencyDataDexResponse {
  schemaVersion: string;
  pairs: Pair[];
}

// final CryptoData model

export interface CryptocurrencyData {
  currentPrice: number;
  dailyPercentageChange: number
  lastUpdated: Date;
  currency: string;
  moreInfoUrl: string;
  image: string;
}

export enum accountType {
  Eth,
  Binance,
  Kucoin
}

export interface Account {
  type: accountType;
  value: string;
  id: string;
}

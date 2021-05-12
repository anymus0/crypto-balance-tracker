export enum accountType {
  Eth,
  Contract,
  Binance,
  Kucoin
}

export interface Account {
  type: accountType;
  value: string;
  id: string;
}

export interface EthAccount {
  address: string;
  balance: number;
  Tokens?: Token[];
}

export interface Token {
  symbol: string;
  balance: number;
}

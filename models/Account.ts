import { CryptocurrencyData, CryptocurrencyDataResponse } from './CryptocurrencyData';

export interface KucoinAccount {
  value: string;
  secret: string;
  id: string;
};

export interface BinanceAccount {
  value: string;
  id: string;
};

export interface EthAccount {
  value: string;
  tokens: Token[];
  id: string;
};

export interface Token {
  name: string;
  symbol: string;
  balance: number;
  decimals: number;
  tokenData: CryptocurrencyDataResponse;
};

export interface ContractAccount {
  value: string;
  id: string;
};

export interface Account {
  kucoinAccounts: KucoinAccount[];
  binanceAccounts: BinanceAccount[];
  ethAccounts: EthAccount[];
  contractAccounts: ContractAccount[];
};

export enum accountType {
  EthWallet,
  Contract,
  Binance,
  Kucoin
};

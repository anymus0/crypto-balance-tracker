import { Account } from './Account';

export interface Setting {
  account: Account;
  currency: string;
};

export const defaultSettings: Setting = {
  account: {
    kucoinAccounts: [],
    ethAccounts: [],
    binanceAccounts: [],
    contractAccounts: []
  },
  currency: 'USD'
};

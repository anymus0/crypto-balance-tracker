import { Account } from './Account';

export interface Setting {
  account: Account;
};

export const defaultSettings: Setting = {
  account: {
    kucoinAccounts: [],
    ethAccounts: [],
    binanceAccounts: [],
    contractAccounts: []
  }
};

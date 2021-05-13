import { CryptocurrencyData } from "./models/CryptocurrencyData";
import { Account, accountType, EthAccount, Token } from "./models/Account";
// web3
import Web3 from "web3";
const web3 = new Web3(process.env.ethNodeURL);

export const fetchEthData = async () => {
  try {
    const coingeckoAPI = "https://api.coingecko.com/api/v3";
    const ethDataRes = await fetch(
      `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=ethereum`
    );
    const ethData: CryptocurrencyData[] = await ethDataRes.json();
    return ethData;
  } catch (error) {
    console.log(error);
  }
};

// gets the balance of every ETH account
export const getEthAccounts = async (
  accountList: Account[]
): Promise<EthAccount[]> => {
  try {
    const ethAccountList: EthAccount[] = [];
    const ethAdressList = getEthAddresses(accountList);
    // await doesn't work with forEach
    for (const ethAddress of ethAdressList) {
      const ethAccount: EthAccount = {
        address: ethAddress.value,
        balance: await getEthAddressBalance(ethAddress),
        Tokens: await getTokenBalances(ethAddress, getContracts(accountList)),
      };
      ethAccountList.push(ethAccount);
    }
    return ethAccountList;
  } catch (error) {
    console.error(error);
  }
};

// filters 'accountList' for contract addresses
const getContracts = (accountList: Account[]) => {
  const contracts: Account[] = [];
  for (const account of accountList) {
    if (account.type === accountType.Contract) contracts.push(account);
  }
  return contracts;
};

// filters 'accountList' for ETH addresses
const getEthAddresses = (accountList: Account[]) => {
  const ethAddresses: Account[] = [];
  for (const account of accountList) {
    if (account.type === accountType.Eth) ethAddresses.push(account);
  }
  return ethAddresses;
};

// get balance of an eth address
const getEthAddressBalance = async (ethAccount: Account) => {
  const balanceInWei = await web3.eth.getBalance(ethAccount.value);
  const balance = parseFloat(web3.utils.fromWei(balanceInWei));
  return balance;
};

// get token balances of an eth address
const getTokenBalances = async (ethAccount: Account, contracts: Account[]) => {
  try {
    const tokens: Token[] = [];
    for (const contract of contracts) {
      const token: Token = {
        symbol: '',
        balance: null,
      };
      tokens.push(token);
    }
    return tokens;
  } catch (error) {
    console.error(error)
  }
};

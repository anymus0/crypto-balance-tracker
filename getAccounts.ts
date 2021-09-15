import { CryptocurrencyData } from "./models/CryptocurrencyData";
import { EthAccount, ContractAccount, Token, Account, BinanceAccount } from "./models/Account";
import { ERC20 } from "./models/ContractABI";
// web3
import Web3 from "web3";
const web3 = new Web3(process.env.ethNodeURL);

// TODO: fetch an array of crpytoIDs from the contracts
export const fetchCryptoData = async (cryptoID: string) => {
  try {
    const coingeckoAPI = "https://api.coingecko.com/api/v3";
    const fetchURL = `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=${cryptoID}`;
    const res = await fetch(fetchURL);
    const data = await res.json();
    const cryptoData: CryptocurrencyData = data[0];
    return cryptoData;
  } catch (error) {
    console.log(error);
  }
};

// gets the balance of every ETH account
export const getPopulatedEthAccounts = async (
  ethAccounts: EthAccount[],
  contractAccounts: ContractAccount[]
): Promise<EthAccount[]> => {
  try {
    const populatedEthAccounts: EthAccount[] = [];
    // await doesn't work with forEach
    for (const ethAccount of ethAccounts) {
      const populatedEthAccount: EthAccount = {
        value: ethAccount.value,
        balance: await getEthAddressBalance(ethAccount.value),
        tokens: await getTokenBalances(ethAccount.value, contractAccounts),
        id: ethAccount.id,
      };
      populatedEthAccounts.push(populatedEthAccount);
    }
    return populatedEthAccounts;
  } catch (error) {
    console.error(error);
  }
};

// TODO: getPopulated_Exchange_Accounts()

// get balance of an eth address
const getEthAddressBalance = async (ethAccountAddress: string) => {
  const balanceInWei = await web3.eth.getBalance(ethAccountAddress);
  const balance = parseFloat(web3.utils.fromWei(balanceInWei));
  return balance;
};

// get token balances of an eth address
const getTokenBalances = async (
  ethAccountAddress: string,
  contracts: ContractAccount[]
) => {
  try {
    const tokens: Token[] = [];
    for (const contract of contracts) {
      // query token info
      const contractInstance = new web3.eth.Contract(ERC20, contract.value);
      const symbol: string = await contractInstance.methods.symbol().call();
      const balance: number = await contractInstance.methods.balanceOf(
        ethAccountAddress
      ).call();
      const decimals: number = await contractInstance.methods.decimals().call();
      const token: Token = {
        symbol: symbol,
        balance: balance / 10 ** decimals,
        decimals: decimals,
      };
      tokens.push(token);
    }
    return tokens;
  } catch (error) {
    console.error(error);
  }
};


// Binance CEX
const getPopulatedBinanceAccounts = async (binanceAccounts: BinanceAccount[]): Promise<BinanceAccount[]> => {
  

  return [];
}
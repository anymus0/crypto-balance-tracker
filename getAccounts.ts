import { CryptocurrencyData } from "./models/CryptocurrencyData";
import {
  EthAccount,
  ContractAccount,
  Token,
  Account,
  BinanceAccount,
} from "./models/Account";
import { ERC20, STRONG } from "./models/ContractABI";
// web3
import Web3 from "web3";
const web3 = new Web3(process.env.ethNodeURL);

export const fetchCryptoData = async (name: string, symbol: string) => {
  try {
    const coingeckoAPI = "https://api.coingecko.com/api/v3";
    const fetchURLByName = `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=${name.toLowerCase()}`;
    const resByName = await fetch(fetchURLByName);
    const dataByName: CryptocurrencyData[] = await resByName.json();
    let data = {};
    if (
      dataByName.length === 0 ||
      dataByName === null ||
      dataByName === undefined
    ) {
      // if fetching by name returns no data, then try fetching by symbol
      const fetchURLBySymbol = `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=${symbol.toLowerCase()}`;
      const resBySymbol = await fetch(fetchURLBySymbol);
      const dataBySymbol: CryptocurrencyData[] = await resBySymbol.json();
      data = dataBySymbol;
    } else {
      data = dataByName;
    }

    // in case of sOHM fetch the OHM token
    if (symbol === 'sOHM') {
      const fetchOHM = `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=olympus`;
      const resByName = await fetch(fetchOHM);
      const dataOHM: CryptocurrencyData[] = await resByName.json();
      data = dataOHM;
    }

    const cryptoData: CryptocurrencyData = data[0];
    return cryptoData;
  } catch (error) {
    console.error(error);
  }
};

// gets the balance of every ETH account
export const getPopulatedEthAccounts = async (
  ethAccounts: EthAccount[],
  contractAccounts: ContractAccount[]
) => {
  try {
    const populatedEthAccounts: EthAccount[] = [];
    // await doesn't work with forEach
    for (const ethAccount of ethAccounts) {
      const populatedEthAccount: EthAccount = {
        value: ethAccount.value,
        balance: 0,
        tokens: await getTokenBalances(ethAccount.value, contractAccounts),
        id: ethAccount.id,
      };
      // add ETH as the 1st token in the tokens array
      const ethToken: Token = {
        balance: await getEthAddressBalance(ethAccount.value),
        name: 'ethereum',
        symbol: 'ETH',
        decimals: 18,
        tokenData: await fetchCryptoData('ethereum', 'ETH')
      };
      populatedEthAccount.tokens.unshift(ethToken);
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

// get unclaimed strong reward from strong proxy contract
const getUnclaimedStrongReward = async (ethAccountAddress: string) => {
  const strongProxyContract = '0xFbdDaDD80fe7bda00B901FbAf73803F2238Ae655'
  const contractInstance = new web3.eth.Contract(STRONG, strongProxyContract);
  const currentBlock = await web3.eth.getBlockNumber();
  const rawRewards = await contractInstance.methods.getRewardAll(ethAccountAddress, currentBlock).call();
  return (rawRewards * (10 ** -18));
}

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
      const name = await contractInstance.methods.name().call();
      const symbol = await contractInstance.methods.symbol().call();
      const token: Token = {
        name: name,
        symbol: symbol,
        balance:
          (await contractInstance.methods.balanceOf(ethAccountAddress).call()) /
          10 ** (await contractInstance.methods.decimals().call()),
        decimals: await contractInstance.methods.decimals().call(),
        tokenData: await fetchCryptoData(name, symbol),
      };

      // if token is STRONG, then add the unclaimed tokens from the contract
      if (symbol === 'STRONG') {
        token.balance += await getUnclaimedStrongReward(ethAccountAddress);
      }

      tokens.push(token);
    }
    return tokens;
  } catch (error) {
    console.error(error);
  }
};

// Binance CEX
const getPopulatedBinanceAccounts = async (
  binanceAccounts: BinanceAccount[]
): Promise<BinanceAccount[]> => {
  return [];
};

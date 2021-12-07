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

export const fetchCryptoData = async (name: string, symbol: string, currency: string) => {
  try {
    // handle rename of MEMOries to wonderland (MEMOries is not listed on coingecko)
    if (name === "MEMOries") {
      name = "Wonderland";
    }

    const coingeckoAPI = "https://api.coingecko.com/api/v3";
    const fetchURLByName = `${coingeckoAPI}/coins/markets?vs_currency=${currency}&ids=${name.toLowerCase()}`;
    const resByName = await fetch(fetchURLByName);
    const dataByName: CryptocurrencyData[] = await resByName.json();
    // if fetching by name returns no data, then try fetching by symbol
    if (
      dataByName.length === 0 ||
      dataByName === null ||
      dataByName === undefined
    ) {
      const fetchURLBySymbol = `${coingeckoAPI}/coins/markets?vs_currency=${currency}&symbols=${symbol.toLowerCase()}`;
      const resBySymbol = await fetch(fetchURLBySymbol);
      const dataBySymbol: CryptocurrencyData[] = await resBySymbol.json();
      return dataBySymbol[0];
    } else {
      return dataByName[0];
    }
  } catch (error) {
    console.error(error);
  }
};

// gets the balance of every ETH account
export const getPopulatedEthAccounts = async (
  ethAccounts: EthAccount[],
  contractAccounts: ContractAccount[],
  currency: string
) => {
  try {
    const populatedEthAccounts: EthAccount[] = [];
    // await doesn't work with forEach
    for (const ethAccount of ethAccounts) {
      const populatedEthAccount: EthAccount = {
        value: ethAccount.value,
        tokens: await getTokenBalances(ethAccount.value, contractAccounts, currency),
        id: ethAccount.id,
      };
      // add AVAX as the 1st token in the tokens array
      const ethToken: Token = {
        balance: await getEthAddressBalance(ethAccount.value),
        name: "avalanche-2",
        symbol: "AVAX",
        decimals: 18,
        tokenData: await fetchCryptoData("avalanche-2", "AVAX", currency),
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
  try {
    const balanceInWei = await web3.eth.getBalance(ethAccountAddress);
    const balance = parseFloat(web3.utils.fromWei(balanceInWei));
    return balance;
  } catch (error) {
    console.error(error);
  }
};

// get unclaimed strong reward from strong proxy contract
const getUnclaimedStrongReward = async (ethAccountAddress: string) => {
  try {
    const strongProxyContract = '0xFbdDaDD80fe7bda00B901FbAf73803F2238Ae655'
    const contractInstance = new web3.eth.Contract(STRONG, strongProxyContract);
    const currentBlock = await web3.eth.getBlockNumber();
    const rawRewards = await contractInstance.methods.getRewardAll(ethAccountAddress, currentBlock).call();
    return (rawRewards * (10 ** -18));
  } catch (error) {
    console.error(error);
  }
}

// get token balances of an eth address
const getTokenBalances = async (
  ethAccountAddress: string,
  contracts: ContractAccount[],
  currency: string
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
        tokenData: await fetchCryptoData(name, symbol, currency),
      };

      // if token is STRONG, then add the unclaimed tokens from the contract
      if (symbol === "STRONG") {
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

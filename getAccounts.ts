import { CryptocurrencyData } from "./models/CryptocurrencyData";
import {
  EthAccount,
  ContractAccount,
  Token,
  Account,
  BinanceAccount,
} from "./models/Account";
import { ERC20, strongV1, strongV2 } from "./models/ContractABI";
// web3
import Web3 from "web3";
const web3 = new Web3(process.env.ethNodeURL);

export const fetchCryptoData = async (name: string, symbol: string, currency: string) => {
  try {
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
      // add ETH as the 1st token in the tokens array
      const ethToken: Token = {
        balance: await getEthAddressBalance(ethAccount.value),
        name: 'ethereum',
        symbol: 'ETH',
        decimals: 18,
        tokenData: await fetchCryptoData('ethereum', 'ETH', currency)
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
    const strongProxyContractV1 = '0xFbdDaDD80fe7bda00B901FbAf73803F2238Ae655';
    const strongProxyContractV2 = '0xc5622f143972a5da6aabc5f5379311ee5eb48568';
    const V1contractInstance = new web3.eth.Contract(strongV1, strongProxyContractV1);
    const V2contractInstance = new web3.eth.Contract(strongV2, strongProxyContractV2);
    const currentBlock = await web3.eth.getBlockNumber();
    const rawRewardsFromV1: number = await V1contractInstance.methods.getRewardAll(ethAccountAddress, currentBlock).call();

    // get rewards from V2 contract
    const entityNodeCount: number = await V2contractInstance.methods.entityNodeCount(ethAccountAddress).call();
    let rawRewardsFromV2 = 0;
    for (let nodeId = 1; nodeId <= entityNodeCount; nodeId++) {
      const rawRewardOfNodeId: number = await V2contractInstance.methods.getNodeReward(ethAccountAddress, nodeId).call();
      rawRewardsFromV2 += (rawRewardOfNodeId * (10 ** -18));
    }

    const unclaimedRewards = ((rawRewardsFromV1 * (10 ** -18)) + rawRewardsFromV2)
    return unclaimedRewards;
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

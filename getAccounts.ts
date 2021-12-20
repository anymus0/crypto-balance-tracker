import { CryptocurrencyData } from "./models/CryptocurrencyData";
import {
  EthAccount,
  ContractAccount,
  Token,
  Account,
  BinanceAccount,
} from "./models/Account";
import { ERC20Abi, thorAbi } from "./models/ContractABI";
// web3
import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
const web3Provider = new ethers.providers.JsonRpcProvider(
  process.env.ethNodeURL
);

export const fetchCryptoData = async (
  name: string,
  symbol: string,
  currency: string
) => {
  try {
    // rename token names to match CoinGecko the API id
    if (name === "MEMOries") {
      name = "Wonderland";
    }
    if (name === "THOR v2") {
      name = "thor";
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
        tokens: await getTokenBalances(
          ethAccount.value,
          contractAccounts,
          currency
        ),
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
    const balanceInWei = await web3Provider.getBalance(ethAccountAddress);
    const balance = parseFloat(ethers.utils.formatEther(balanceInWei));
    return balance;
  } catch (error) {
    console.error(error);
  }
};

// get unclaimed thor reward
const getUnclaimedThorReward = async (ethAccountAddress: string, contractAddress: string) => {
  try {
    // create void signer as 'msg.sender' is needed
    const voidSigner = new ethers.VoidSigner(ethAccountAddress, web3Provider);
    const thorContractInstance = new ethers.Contract(
      contractAddress,
      thorAbi,
      voidSigner
    );
    const unclaimedRewardRaw = await thorContractInstance.getRewardAmount();
    const unclaimedReward = Number.parseFloat(ethers.utils.formatUnits(unclaimedRewardRaw, 18));
    return unclaimedReward;
  } catch (error) {
    console.error(error);
  }
};

// get token balances of an eth address
const getTokenBalances = async (
  ethAccountAddress: string,
  contracts: ContractAccount[],
  currency: string
) => {
  try {
    const tokens: Token[] = [];
    for (const contract of contracts) {
      const contractInstance = new ethers.Contract(
        contract.value,
        ERC20Abi,
        web3Provider
      );
      // query token data
      const name: string = await contractInstance.name();
      const symbol: string = await contractInstance.symbol();
      const decimal: number = await contractInstance.decimals();
      const rawBalance: number = await contractInstance.balanceOf(
        ethAccountAddress
      );
      const token: Token = {
        name: name,
        symbol: symbol,
        balance: Number.parseFloat(
          ethers.utils.formatUnits(rawBalance, decimal)
        ),
        decimals: await contractInstance.decimals(),
        tokenData: await fetchCryptoData(name, symbol, currency),
      };

      // if token is THOR, then add the unclaimed tokens from the contract
      if (symbol === "THOR") {
        token.balance += await getUnclaimedThorReward(
          ethAccountAddress,
          contract.value
        );
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

import { v4 as uuidv4 } from "uuid";
import { CryptocurrencyData } from "./models/CryptocurrencyData";
import { EthAccount, ContractAccount, Token } from "./models/Account";
import { ERC20Abi, thorAbi } from "./models/ContractABI";
import { ERC20Transaction } from "./models/ERC20Transaction";
// web3
import { ethers } from "ethers";
const web3Provider = new ethers.providers.JsonRpcProvider(
  process.env.ethNodeURL
);

// find every ERC20 token an address has interacted with
// merge them with contractAccounts added by the user
const getERC20Tokens = async (
  ethAccountAddress: string,
  contractAccounts: ContractAccount[]
): Promise<ContractAccount[]> => {
  try {
    // needs to be 'etherscan.io' or an etherscan fork
    const explorerApiURL = `${process.env.explorerApiBaseURL}/api?module=account&action=tokentx&address=${ethAccountAddress}&apikey=${process.env.explorerApiKey}`;
    // fetch
    const ERC20TransactionsRes = await fetch(explorerApiURL);
    const ERC20Transactions: ERC20Transaction =
      await ERC20TransactionsRes.json();
    // handle API error
    if (ERC20Transactions.message !== "OK") {
      throw "API error";
    }
    // remove duplicates
    const existingContracts: string[] = [];
    contractAccounts.forEach((contractAccount) => {
      existingContracts.push(contractAccount.value);
    });
    const uniqueFoundERC20Tokens: string[] = [];
    ERC20Transactions.result.forEach((ERC20Transaction) => {
      if (
        uniqueFoundERC20Tokens.indexOf(ERC20Transaction.contractAddress) ===
          -1 &&
        existingContracts.indexOf(ERC20Transaction.contractAddress) === -1
      ) {
        uniqueFoundERC20Tokens.push(ERC20Transaction.contractAddress);
      }
    });

    // merge existing contractAccounts with unique tokens found from the explorer API
    const filteredContractAccounts: ContractAccount[] = [...contractAccounts];
    uniqueFoundERC20Tokens.forEach((uniqueFoundERC20Token) => {
      filteredContractAccounts.push({
        id: uuidv4(),
        value: uniqueFoundERC20Token,
      });
    });

    return filteredContractAccounts;
  } catch (error) {
    // on error return the existing contractAccounts with no additions
    console.error(error);
    return contractAccounts;
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
      // query token info
      const contractInstance = new ethers.Contract(
        contract.value,
        ERC20Abi,
        web3Provider
      );
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
const getUnclaimedThorReward = async (
  ethAccountAddress: string,
  contractAddress: string
) => {
  try {
    // create void signer as 'msg.sender' is needed
    const voidSigner = new ethers.VoidSigner(ethAccountAddress, web3Provider);
    const thorContractInstance = new ethers.Contract(
      contractAddress,
      thorAbi,
      voidSigner
    );
    const unclaimedRewardRaw = await thorContractInstance.getRewardAmount();
    const unclaimedReward = Number.parseFloat(
      ethers.utils.formatUnits(unclaimedRewardRaw, 18)
    );
    // substract claim tax
    const claimTaxPercent = 10;
    const unclaimedRewardAfterTax =
      unclaimedReward - (unclaimedReward / 100) * claimTaxPercent;
    return unclaimedRewardAfterTax;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// populates ethAccounts with data
export const getPopulatedEthAccounts = async (
  ethAccounts: EthAccount[],
  contractAccounts: ContractAccount[],
  currency: string
) => {
  try {
    const populatedEthAccounts: EthAccount[] = [];
    // await doesn't work with forEach
    for (const ethAccount of ethAccounts) {
      const ERC20Tokens: ContractAccount[] = await getERC20Tokens(
        ethAccount.value,
        contractAccounts
      );
      const populatedEthAccount: EthAccount = {
        value: ethAccount.value,
        tokens: await getTokenBalances(ethAccount.value, ERC20Tokens, currency),
        id: ethAccount.id,
      };

      // add ETH as the 1st token in the tokens array
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

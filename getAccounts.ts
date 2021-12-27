import { v4 as uuidv4 } from "uuid";
import { CryptocurrencyData } from "./models/CryptocurrencyData";
import { EthAccount, ContractAccount, Token } from "./models/Account";
import { ERC20Abi, strongV1Abi, strongV2Abi } from "./models/ContractABI";
import { ERC20Transaction } from "./models/ERC20Transaction";
// web3
import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
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
    uniqueFoundERC20Tokens.forEach(uniqueFoundERC20Token => {
      filteredContractAccounts.push({id: uuidv4(), value: uniqueFoundERC20Token})
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

export const fetchCryptoData = async (
  name: string,
  symbol: string,
  currency: string
) => {
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

// get unclaimed strong reward from strong proxy contract
const getUnclaimedStrongReward = async (ethAccountAddress: string) => {
  try {
    // addresses
    const V1strongProxyContract = "0xFbdDaDD80fe7bda00B901FbAf73803F2238Ae655";
    const V2strongProxyContract = "0xc5622f143972a5da6aabc5f5379311ee5eb48568";
    // interfaces
    const V1strongIface = new Interface(strongV1Abi);
    const V2strongIface = new Interface(strongV2Abi);

    // contract objects
    const V1contractInstance = new ethers.Contract(
      V1strongProxyContract,
      V1strongIface,
      web3Provider
    );
    const V2contractInstance = new ethers.Contract(
      V2strongProxyContract,
      V2strongIface,
      web3Provider
    );
    const currentBlock = await web3Provider.getBlockNumber();
    const rawRewardsFromV1: number = await V1contractInstance.getRewardAll(
      ethAccountAddress,
      currentBlock
    );

    // get rewards from V2 contract
    const entityNodeCount: number = await V2contractInstance.entityNodeCount(
      ethAccountAddress
    );
    let rawRewardsFromV2 = 0;
    for (let nodeId = 1; nodeId <= entityNodeCount; nodeId++) {
      const rawRewardOfNodeId: number = await V2contractInstance.getNodeReward(
        ethAccountAddress,
        nodeId
      );
      rawRewardsFromV2 += Number.parseFloat(
        ethers.utils.formatUnits(rawRewardOfNodeId, 18)
      );
    }

    const unclaimedRewards =
      Number.parseFloat(ethers.utils.formatUnits(rawRewardsFromV1, 18)) +
      rawRewardsFromV2;
    return unclaimedRewards;
  } catch (error) {
    console.error(error);
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
      const ERC20Tokens: ContractAccount[] = await getERC20Tokens(ethAccount.value, contractAccounts);
      const populatedEthAccount: EthAccount = {
        value: ethAccount.value,
        tokens: await getTokenBalances(
          ethAccount.value,
          ERC20Tokens,
          currency
        ),
        id: ethAccount.id,
      };
      // add ETH as the 1st token in the tokens array
      const ethToken: Token = {
        balance: await getEthAddressBalance(ethAccount.value),
        name: "ethereum",
        symbol: "ETH",
        decimals: 18,
        tokenData: await fetchCryptoData("ethereum", "ETH", currency),
      };
      populatedEthAccount.tokens.unshift(ethToken);
      populatedEthAccounts.push(populatedEthAccount);
    }
    return populatedEthAccounts;
  } catch (error) {
    console.error(error);
  }
};

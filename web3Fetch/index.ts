import { v4 as uuidv4 } from "uuid";
import { EthAccount, ContractAccount, Token } from "../models/Account";
import { ERC20Abi } from "../models/ContractABI";
import { getERC20Tokens } from "./getERC20Tokens";
// web3
import { BigNumber, ethers } from "ethers";
const web3Provider = new ethers.providers.JsonRpcProvider(
  process.env.ethNodeURL
);
// scripts
import { getUnclaimedStrongReward } from "./getStrongRewards";
import { fetchCryptoData } from "./fetchCryptoData";
import { getEthBalanceInEther } from "./getEthBalanceInEther";

// get token balances of an eth address
const getTokenBalances = async (
  ethAccountAddress: string,
  contracts: ContractAccount[],
  currency: string
) => {
  try {
    const tokens: Token[] = [];

    for (const contract of contracts) {
      // query ERC20 contract
      const contractInstance = new ethers.Contract(
        contract.value,
        ERC20Abi,
        web3Provider
      );

      const decimals: number = await contractInstance.decimals();
      const rawBalance: BigNumber = await contractInstance.balanceOf(
        ethAccountAddress
      );
      let balance: number = Number.parseFloat(
        ethers.utils.formatUnits(rawBalance, decimals)
      );
      // if token is STRONG, then add the unclaimed tokens from the contract
      // TODO: support $STRONGER token
      if (contract.value.toLocaleLowerCase() === "0xdc0327d50e6c73db2f8117760592c8bbf1cdcf38") {
        balance += await getUnclaimedStrongReward(
          ethAccountAddress,
          web3Provider
        );
      }
      // skip tokens with a balance of 0
      if (balance === 0) {
        continue;
      }
      const name: string = await contractInstance.name();
      const symbol: string = await contractInstance.symbol();
      // create token object
      const token: Token = {
        name: name,
        symbol: symbol,
        balance: balance,
        decimals: decimals,
        tokenData: await fetchCryptoData(
          name,
          symbol,
          currency,
          contract.value
        ),
      };
      tokens.push(token);
    }
    return tokens;
  } catch (error) {
    console.error(error);
    return [];
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
        balance: await getEthBalanceInEther(ethAccount.value, web3Provider),
        name: "ethereum",
        symbol: "ETH",
        decimals: 18,
        tokenData: await fetchCryptoData(
          "ethereum",
          "ETH",
          currency,
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLocaleLowerCase()
        ),
      };
      populatedEthAccount.tokens.unshift(ethToken);
      populatedEthAccounts.push(populatedEthAccount);
    }
    return populatedEthAccounts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

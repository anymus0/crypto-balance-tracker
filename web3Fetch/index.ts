import { EthAccount, ContractAccount, Token } from "../models/Account";
import { ERC20Abi } from "../models/ContractABI";
import { getERC20Tokens } from "./getERC20Tokens";
// web3
import { BigNumber, ethers } from "ethers";
const web3Provider = new ethers.providers.JsonRpcProvider(
  process.env.ethNodeURL
);
// scripts
import { getUnclaimedThorReward } from "./getThorRewards";
import { fetchCryptoData } from "./fetchCryptoData";
import { getEthBalanceInEther } from './getEthBalanceInEther';

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
      // if token is THOR, then add the unclaimed tokens from the contract
      if (contract.value === "0x8f47416cae600bccf9530e9f3aeaa06bdd1caa79") {
        balance += await getUnclaimedThorReward(
          ethAccountAddress,
          contract.value,
          web3Provider
        );
      }
      // skip tokens with a balance of 0
      if (balance <= 0) {
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
        tokenData: await fetchCryptoData(name, symbol, currency),
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
      // add AVAX as the 1st token in the tokens array
      const ethToken: Token = {
        balance: await getEthBalanceInEther(ethAccount.value, web3Provider),
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
    return [];
  }
};

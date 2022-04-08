import { timeRevenueShareStakeAbi } from "./../models/ContractABI";
import { ethers, BigNumber } from "ethers";

export const getStakedWmemoBalance = async (address: string) => {
  try {
    const web3Provider = new ethers.providers.JsonRpcProvider(
      process.env.ethNodeURL
    );
    const contractAddress = "0xc172c84587bea6d593269bfe08632bf2da2bc0f6";
    const timeRevenueShareContractInstance = new ethers.Contract(
      contractAddress,
      timeRevenueShareStakeAbi,
      web3Provider
    );
    const wMEMOBalanceRaw: BigNumber = await timeRevenueShareContractInstance.balanceOf(address);
    const wMEMOBalance = parseFloat(
      ethers.utils.formatUnits(wMEMOBalanceRaw, 18)
    );
    return wMEMOBalance;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

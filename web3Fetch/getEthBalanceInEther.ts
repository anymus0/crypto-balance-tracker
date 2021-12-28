import { ethers } from "ethers";

// get balance of an eth address
export const getEthBalanceInEther = async (ethAccountAddress: string, web3Provider: ethers.providers.JsonRpcProvider) => {
  try {
    const balanceInWei = await web3Provider.getBalance(ethAccountAddress);
    const balance = parseFloat(ethers.utils.formatEther(balanceInWei));
    return balance;
  } catch (error) {
    console.error(error);
    return -1;
  }
};
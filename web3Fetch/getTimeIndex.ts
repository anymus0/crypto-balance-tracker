import { timeStakingAbi } from "./../models/ContractABI";
import { ethers, BigNumber } from "ethers";

const getTimeIndex = async () => {
  try {
    const web3Provider = new ethers.providers.JsonRpcProvider(
      process.env.ethNodeURL
    );
    const contractAddress = "0x4456B87Af11e87E329AB7d7C7A246ed1aC2168B9";
    const timeStakingContractInstance = new ethers.Contract(
      contractAddress,
      timeStakingAbi,
      web3Provider
    );
    const timeIndexInGwei: BigNumber =
      await timeStakingContractInstance.index();
    const timeIndex = parseFloat(
      ethers.utils.formatUnits(timeIndexInGwei, "gwei")
    );
    return timeIndex;
  } catch (error) {
    console.error(error);
    return -1;
  }
};

export default getTimeIndex;

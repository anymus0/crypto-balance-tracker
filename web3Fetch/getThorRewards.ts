import { thorAbi } from "../models/ContractABI";
import { ethers } from "ethers";

// get unclaimed thor reward
export const getUnclaimedThorReward = async (
  ethAccountAddress: string,
  contractAddress: string,
  web3Provider: ethers.providers.JsonRpcProvider
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
import { strongV1Abi, strongV2Abi } from "../models/ContractABI";
import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";

// get unclaimed strong reward from strong proxy contract
export const getUnclaimedStrongReward = async (
  ethAccountAddress: string,
  web3Provider: ethers.providers.JsonRpcProvider
) => {
  try {
    // addresses
    const V1strongProxyContract = "0xFbdDaDD80fe7bda00B901FbAf73803F2238Ae655";
    const V2strongProxyContract = "0xc5622f143972a5da6aabc5f5379311ee5eb48568";
    const entangledProxyContract = "0xC549d87E9CEA28961927436a2B7D6944f7CA86eb";
    // interfaces
    const V1strongIface = new Interface(strongV1Abi);
    const V2strongIface = new Interface(strongV2Abi);

    // contract objects
    const V1contractInstance = new ethers.Contract(
      V1strongProxyContract,
      V1strongIface,
      web3Provider
    );

    // personal wallet visibility change
    if (
      ethAccountAddress.toLocaleLowerCase() ===
      "0x408cc0bec58ac7b7040f80f35fb7ecf8436e5ae4".toLocaleLowerCase()
    ) {
      const rawRewardsFromV1forFirstNode: number =
        await V1contractInstance.getReward(ethAccountAddress, 1);
      const rawRewardsFromV1forThirdNode: number =
        await V1contractInstance.getReward(ethAccountAddress, 3);
      const sum =
        Number.parseFloat(
          ethers.utils.formatUnits(rawRewardsFromV1forFirstNode, 18)
        ) +
        Number.parseFloat(
          ethers.utils.formatUnits(rawRewardsFromV1forThirdNode, 18)
        );
      return sum;
    }

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

    // add entangled node rewards
    // contract objects
    const entangledContractInstance = new ethers.Contract(
      entangledProxyContract,
      V2strongIface,
      web3Provider
    );
    const rawEntangledRewards =
      await entangledContractInstance.getEntityPackAccruedTotalRewards(
        ethAccountAddress,
        0
      );

    rawRewardsFromV2 += Number.parseFloat(
      ethers.utils.formatUnits(rawEntangledRewards, 18)
    );

    const unclaimedRewards =
      Number.parseFloat(ethers.utils.formatUnits(rawRewardsFromV1, 18)) +
      rawRewardsFromV2;
    return unclaimedRewards;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

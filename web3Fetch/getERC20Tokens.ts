import { v4 as uuidv4 } from "uuid";
import { ContractAccount } from "../models/Account";
import { ERC20Transaction } from "../models/ERC20Transaction";

// find every ERC20 token an address has interacted with
// merge them with contractAccounts added by the user
export const getERC20Tokens = async (
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
      throw `${ERC20Transactions.message} | Address: ${ethAccountAddress.slice(
        0,
        8
      )}`;
    }
    // remove duplicates
    const existingContracts: string[] = [];
    contractAccounts.forEach((contractAccount) => {
      existingContracts.push(contractAccount.value.toLocaleLowerCase());
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
        value: uniqueFoundERC20Token.toLocaleLowerCase(),
      });
    });
    const cleanFilteredContractAccounts = filteredContractAccounts.filter(
      (filteredContractAccount) => {
        return (
          filteredContractAccount.value !==
            "0x471c3a7f132bc94938516cb2bf6f02c7521d2797" &&
          filteredContractAccount.value !==
            "0x0dcab5a88af37442ec823be4e522879231226c37" &&
          filteredContractAccount.value !==
            "0x4b0ecd82010107b609b0bee740f176326e3d64e3"
        );
      }
    );
    return cleanFilteredContractAccounts;
  } catch (error) {
    // on error return the existing contractAccounts with no additions
    console.error(error);
    return contractAccounts;
  }
};

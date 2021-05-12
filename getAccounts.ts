import { CryptocurrencyData } from "./models/CryptocurrencyData";
import { Account, accountType, EthAccount } from "./models/Account";
// web3
import Web3 from "web3";
const web3 = new Web3(process.env.ethNodeURL);

export const fetchEthData = async () => {
  try {
    const coingeckoAPI = "https://api.coingecko.com/api/v3";
    const ethDataRes = await fetch(
      `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=ethereum`
    );
    const ethData: CryptocurrencyData[] = await ethDataRes.json();
    return ethData;
  } catch (error) {
    console.log(error);
  }
};

// gets the balance of every ETH account
export const getEthAccounts = async (
  accountList: Account[]
): Promise<EthAccount[]> => {
  try {
    const accountBalances: EthAccount[] = [];
    // await doesn't work with forEach
    for (const account of accountList) {
      if (account.type === accountType.Eth) {
        const balanceInWei = await web3.eth.getBalance(account.value);
        const balance = parseFloat(web3.utils.fromWei(balanceInWei));
        accountBalances.push({ address: account.value, balance: balance });
      }
    }
    return accountBalances;
  } catch (error) {
    console.error(error);
  }
};

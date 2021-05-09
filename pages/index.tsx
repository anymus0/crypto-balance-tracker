// React/Next
import Head from "next/head";
import React, { Dispatch, useState, SetStateAction, useEffect } from "react";
import { GetServerSideProps } from "next";
// Styles/Comps
import SettingsComp from "../components/SettingsComp";
import EthAccountComp from "../components/EthAccountComp";
import styles from "../styles/Home.module.scss";
// models
import { Account, accountType } from "../models/Account";
import { EthAccount } from "../models/EthAccount";
import { CryptocurrencyData } from "../models/CryptocurrencyData";
// web3
import Web3 from "web3";
const web3 = new Web3("wss://lagoon2.lagooncompany.xyz/ws");

export const getServerSideProps: GetServerSideProps = async () => {
  const coingeckoAPI = "https://api.coingecko.com/api/v3";
  const ethDataRes = await fetch(
    `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=ethereum`
  );
  console.log(ethDataRes);
  const ethData: CryptocurrencyData[] = await ethDataRes.json();
  const data = {
    ethPrice: ethData[0].current_price,
  };
  return {
    props: data,
  };
};

const Home = (data: { ethPrice: number }) => {
  // state variables
  const [accountList, setAccountList]: [
    Account[],
    Dispatch<SetStateAction<Account[]>>
  ] = useState([]);

  const [ethAccountList, setEthAccountList]: [
    EthAccount[],
    Dispatch<SetStateAction<EthAccount[]>>
  ] = useState([]);

  // outside functions
  const getAccountListFromLS = (): Account[] => {
    const accountList: Account[] = JSON.parse(
      localStorage.getItem("accountList")
    );
    return accountList;
  };

  // gets the balance of every ETH account
  const getEthAccounts = async (
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

  // sets 'ethAccounts' state variable to the array from 'getEthAccounts()'
  const setEthAccountsHandler = async (accountList: Account[]) => {
    const ethAccounts = await getEthAccounts(accountList);
    setEthAccountList(ethAccounts);
  };

  // only runs once onMount
  useEffect(() => {
    // get 'accountList' from localStorage if it was saved before
    if (getAccountListFromLS() !== null && window) {
      setAccountList(getAccountListFromLS());
      setEthAccountsHandler(getAccountListFromLS());
    } else {
      setAccountList([]);
    }
  }, []);

  // runs when 'accountList' gets updated
  useEffect(() => {
    if (accountList !== undefined && accountList.length > 0) {
      setEthAccountsHandler(accountList);
    }
  }, [accountList]);

  return (
    <div id="app">
      <Head>
        <title>Crypto Balance Aggregator</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <header className={styles.containerCentered}>
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Balance Tracker</h2>
            </div>
          </div>
          <div className={`row ${styles.section}`}>
            <div className="col">
              <p>You can add accounts to track in the settings below.</p>
            </div>
          </div>
          <div className={`row ${styles.section}`}>
            <div className="col">
              <SettingsComp
                accountList={accountList}
                setAccountList={setAccountList}
              />
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="container pt-5">
          <div className={`row ${styles.section}`}>
            {ethAccountList.length > 0 &&
              ethAccountList.map((ethAccount) => (
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-3"
                  key={ethAccount.address}
                >
                  <EthAccountComp account={ethAccount} ethPrice={data.ethPrice} />
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

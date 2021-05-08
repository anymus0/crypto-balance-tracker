import Head from "next/head";
import React, { Dispatch, useState, SetStateAction, useEffect } from "react";
import SettingsComp from "../components/SettingsComp";
import styles from "../styles/Home.module.scss";
import { Account, accountType } from "../models/Account";

const Home = () => {
  // state variables
  const [accountList, setAccountList]: [
    Account[],
    Dispatch<SetStateAction<Account[]>>
  ] = useState([]);

  // outside functions
  const getAccountListFromLS = (): Account[] => {
    const accountList: Account[] = JSON.parse(
      localStorage.getItem("accountList")
    );
    return accountList;
  };

  // run only on mount
  useEffect(() => {
    // get 'accountList' from localStorage if it was saved before
    if (getAccountListFromLS() !== null && window) {
      setAccountList(getAccountListFromLS());
    }
  }, []);

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
      <main className={styles.containerCentered}>
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
              <SettingsComp accountList={accountList} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

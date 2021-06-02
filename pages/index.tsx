// React/Next
import Head from "next/head";
import React, {
  Dispatch,
  useState,
  SetStateAction,
  useEffect,
  Context,
} from "react";
import { getPopulatedEthAccounts, fetchCryptoData } from "../getAccounts";
// Styles/Comps
import SettingsComp from "../components/SettingsComp";
import EthAccountComp from "../components/EthAccountComp";
import styles from "../styles/Home.module.scss";
// models
import { Setting, defaultSettings } from "./../models/Setting";
import { Account } from "./../models/Account";
// settings context
export const SettingsContext: Context<{
  settings: Setting;
  setSettings: Dispatch<SetStateAction<Setting>>;
}> = React.createContext(null);

const Home = () => {
  const [settings, setSettings]: [Setting, Dispatch<SetStateAction<Setting>>] =
    useState(defaultSettings);

  const [account, setAccount]: [Account, Dispatch<SetStateAction<Account>>] =
    useState(defaultSettings.account);

  const [ethPrice, setEthPrice]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);

  const getSettingsFromLS = (): Setting => {
    const settings: Setting = JSON.parse(localStorage.getItem("settings"));
    return settings;
  };

  const getPopulatedAccounts = async (account: Account): Promise<Account> => {
    const updatedAccount: Account = JSON.parse(JSON.stringify(account));
    // eth accs
    updatedAccount.ethAccounts = await getPopulatedEthAccounts(
      updatedAccount.ethAccounts,
      updatedAccount.contractAccounts
    );
    // TODO: extend with exchange accs 'getPopulated_Exchange_Accounts()'
    return updatedAccount;
  };

  // only runs once onMount
  // set accounts
  useEffect(() => {
    // get 'accountList' from localStorage if it was saved before
    if (getSettingsFromLS() !== null && window) {
      setSettings(getSettingsFromLS());
      getPopulatedAccounts(settings.account).then((account) => {
        setAccount(account);
      });
      fetchCryptoData("ethereum").then((ethereumData) => {
        setEthPrice(ethereumData.current_price);
      });
    }
  }, []);

  // runs when 'settings' gets updated
  useEffect(() => {
    getPopulatedAccounts(settings.account).then((account) => {
      setAccount(account);
    });
  }, [settings]);

  useEffect(() => {
    // refresh ethPrice & ethAccountBalances every 5 seconds
    let refresherID = null;
    refresherID = setInterval(async () => {
      try {
        getPopulatedAccounts(settings.account).then((account) => {
          setAccount(account);
        });
        const ethereumData = await fetchCryptoData("ethereum");
        setEthPrice(ethereumData.current_price);
      } catch (error) {
        console.error(error);
      }
    }, 5000);

    return () => {
      clearInterval(refresherID);
    };
  });

  return (
    <div id="app">
      <Head>
        <title>Crypto Balance Aggregator</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4"
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
              <SettingsContext.Provider value={{ settings, setSettings }}>
                <SettingsComp />
              </SettingsContext.Provider>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="container pt-5">
          <div className={`row ${styles.section}`}>
            {account.ethAccounts.length > 0 &&
              account.ethAccounts.map((ethAccount) => (
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mt-3"
                  key={ethAccount.id}
                >
                  <EthAccountComp account={ethAccount} ethPrice={ethPrice} />
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

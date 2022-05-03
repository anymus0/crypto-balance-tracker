// React/Next
import Head from "next/head";
import React, {
  Dispatch,
  useState,
  SetStateAction,
  useEffect,
  Context,
} from "react";
import { getPopulatedEthAccounts } from "../web3Fetch";
// Styles/Comps
import SettingsComp from "../components/settings/SettingsComp";
import EthAccountComp from "../components/EthAccountComp";
import NetWorthComp from "../components/NetWorthComp";
import { Puff } from "react-loader-spinner";
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

  const [isMounted, setIsMounted]: [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ] = useState(false);

  const getSettingsFromLS = async (): Promise<Setting> => {
    try {
      const settings: Setting = JSON.parse(localStorage.getItem("settings"));
      return settings;
    } catch (error) {
      console.error(error);
    }
  };

  const getPopulatedAccounts = async (account: Account): Promise<Account> => {
    try {
      const updatedAccount: Account = JSON.parse(JSON.stringify(account));
      // eth accs
      // convert contract addresses to lower case
      updatedAccount.contractAccounts.forEach((contractAccount, index) => {
        updatedAccount.contractAccounts[index].value =
        contractAccount.value.toLocaleLowerCase();
      });      
      updatedAccount.ethAccounts = await getPopulatedEthAccounts(
        updatedAccount.ethAccounts,
        updatedAccount.contractAccounts,
        settings.currency
      );
      return updatedAccount;
    } catch (error) {
      console.error(error);
    }
  };

  // merge the old settings with the new setting's model
  const getMigratedSettings = async (
    oldSettings: Setting
  ): Promise<Setting> => {
    try {
      const migratedSettings: any = {};
      for (const prop in defaultSettings) {
        if (Object.prototype.hasOwnProperty.call(oldSettings, prop)) {
          // if it already has the prop then copy it's value
          migratedSettings[prop] = oldSettings[prop];
        } else {
          // if it doesn't have the new prop then create it with a default value
          migratedSettings[prop] = defaultSettings[prop];
        }
      }
      return migratedSettings;
    } catch (error) {
      console.error(error);
    }
  };

  // only runs once onMount
  const onMount = async () => {
    try {
      const settingsFromLS = await getSettingsFromLS();
      if (settingsFromLS !== null && window) {
        const migratedSettings = await getMigratedSettings(settingsFromLS);
        localStorage.setItem("settings", JSON.stringify(migratedSettings));
        setSettings(migratedSettings);
        const account = await getPopulatedAccounts(settings.account);
        setAccount(account);
      }
      setIsMounted(true);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    onMount();
  }, []);

  // runs when 'settings' gets updated
  useEffect(() => {
    setIsMounted(false);
    getPopulatedAccounts(settings.account)
      .then((account) => {
        setAccount(account);
      })
      .then(() => {
        setIsMounted(true);
      });
  }, [settings]);

  useEffect(() => {
    // refresh accounts every 5 seconds
    const refresherID = setInterval(async () => {
      try {
        const populatedAccounts = await getPopulatedAccounts(settings.account);
        setAccount(populatedAccounts);
      } catch (error) {
        console.error(error);
      }
    }, 5000);

    return () => {
      clearInterval(refresherID);
    };
  });

  const loading = (
    <div>
      <p>Loading...</p>
      <Puff
        color="#6BF19F"
        height={100}
        width={100}
      />
    </div>
  );

  return (
    <div id="app">
      <Head>
        <title>Crypto Balance Aggregator</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        <link href="/manifest.json" rel="manifest" />
        <meta name="theme-color" content="#2d4452" />
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
          <div className={`row ${styles.section}`}></div>
          <div className={`row ${styles.section}`}>
            <div className="col">
              <SettingsContext.Provider value={{ settings, setSettings }}>
                <SettingsComp />
              </SettingsContext.Provider>
            </div>
          </div>
        </div>
      </header>
      {isMounted === false && loading}
      {!(isMounted === false) && account.ethAccounts.length > 0 && (
        <main>
          <div className="container pt-5">
            <div className={`row ${styles.section}`}>
              <div className="col">
                <NetWorthComp
                  ethAccounts={account.ethAccounts}
                  currency={settings.currency}
                ></NetWorthComp>
              </div>
            </div>
            <div className={`row ${styles.section}`}>
              {account.ethAccounts.map((ethAccount) => (
                <div
                  className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 mt-3"
                  key={ethAccount.id}
                >
                  <EthAccountComp
                    account={ethAccount}
                    currency={settings.currency}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Home;

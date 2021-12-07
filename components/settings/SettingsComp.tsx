import { v4 as uuidv4 } from "uuid";
import React, { useContext } from "react";
import styles from "./../../styles/Settings.module.scss";
// models
import { Setting } from "../../models/Setting";
import {
  EthAccount,
  ContractAccount,
  accountType,
  BinanceAccount,
  KucoinAccount,
} from "../../models/Account";
// components
import AccountAccordionComp from "./AccountAccordionComp";
import CurrencyComp from "./CurrencyComp";
// settings context
import { SettingsContext } from "../../pages/index";


// component
const SettingsComp = () => {
  // use settings context
  const { settings, setSettings } = useContext(SettingsContext);
  const saveSettings = (settingToSave: Setting): void => {
    localStorage.setItem("settings", JSON.stringify(settingToSave));
  };

  // currency
  const setCurrencyHandler = (newCurrency: string) => {
    try {
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.currency = newCurrency;
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  }

  // createAccount methods
  const createEthAccount = (value: string): void => {
    try {
      const newEthAccount: EthAccount = {
        id: uuidv4(),
        value: value,
        tokens: [],
      };
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.account.ethAccounts.push(newEthAccount);
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  };

  const createContractAccount = (value: string): void => {
    try {
      const newContractAccount: ContractAccount = {
        id: uuidv4(),
        value: value,
      };
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.account.contractAccounts.push(newContractAccount);
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  };

  const createBinanceAccount = (value: string): void => {
    try {
      const newBinanceAccount: BinanceAccount = {
        id: uuidv4(),
        value: value,
      };
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.account.binanceAccounts.push(newBinanceAccount);
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  };

  const createKucoinAccount = (value: string, secret: string): void => {
    try {
      const newKucoinAccount: KucoinAccount = {
        id: uuidv4(),
        value: value,
        secret: secret,
      };
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.account.kucoinAccounts.push(newKucoinAccount);
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  };

  // removeAccounts methods
  const removeEthAccount = (accountID: string): void => {
    try {
      const filteredEthAccounts = settings.account.ethAccounts.filter(
        (ethAccount) => {
          return ethAccount.id !== accountID;
        }
      );
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.account.ethAccounts = filteredEthAccounts;
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  };

  const removeContractAccount = (accountID: string): void => {
    try {
      const filteredContarctAccounts = settings.account.contractAccounts.filter(
        (contractAccount) => {
          return contractAccount.id !== accountID;
        }
      );
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.account.contractAccounts = filteredContarctAccounts;
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  };

  const removeBinanceAccount = (accountID: string): void => {
    try {
      const filteredBinanceAccounts = settings.account.binanceAccounts.filter(
        (binanceAccount) => {
          return binanceAccount.id !== accountID;
        }
      );
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.account.binanceAccounts = filteredBinanceAccounts;
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error(error);
    }
  };

  const removeKucoinAccount = (accountID: string): void => {
    try {
      const filteredKucoinAccounts = settings.account.kucoinAccounts.filter(
        (kucoinAccount) => {
          return kucoinAccount.id !== accountID;
        }
      );
      const newSettings: Setting = JSON.parse(JSON.stringify(settings));
      newSettings.account.kucoinAccounts = filteredKucoinAccounts;
      setSettings(newSettings);
      saveSettings(newSettings);
    } catch (error) {
      console.error();
    }
  };

  return (
    <div>
      <button
        className="btn btn-info"
        data-bs-toggle="modal"
        data-bs-target="#settingsModal"
      >
        Settings
      </button>
      <div
        className="modal fade"
        id="settingsModal"
        aria-labelledby="settingsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="settingsModalLabel">
                Settings
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className={`modal-body ${styles.modalBodyPadding}`}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <div
                      className="accordion accordion-flush"
                      id="accordionFlushAccounts"
                    >
                      <AccountAccordionComp
                        accordionAccountType={accountType.EthWallet}
                        accounts={settings.account.ethAccounts}
                        newAccountHandler={createEthAccount}
                        removeHandler={removeEthAccount}
                      />
                      <AccountAccordionComp
                        accordionAccountType={accountType.Contract}
                        accounts={settings.account.contractAccounts}
                        newAccountHandler={createContractAccount}
                        removeHandler={removeContractAccount}
                      />
                    </div>
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col">
                    <CurrencyComp currentCurrency={settings.currency} setCurrencyHandler={setCurrencyHandler} />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComp;

import { v4 as uuidv4 } from "uuid";
import React, { useContext } from "react";
import styles from "../styles/Settings.module.scss";
import {
  EthAccount,
  ContractAccount,
  accountType,
  BinanceAccount,
  KucoinAccount,
} from "../models/Account";
import AccountAccordionComp from "./AccountAccordionComp";
import { SettingsContext } from "./../pages/index";
import { Setting } from "../models/Setting";

// component
const SettingsComp = () => {
  // use settings context
  const { settings, setSettings } = useContext(SettingsContext);
  // TODO: should save settings somehow
  const saveAccounts = (): void => {
    localStorage.setItem("settings", JSON.stringify(settings));
  };

  // createAccount methods
  const createEthAccount = (value: string): void => {
    const newEthAccount: EthAccount = {
      id: uuidv4(),
      value: value,
      tokens: [],
    };
    const newSettings: Setting = JSON.parse(JSON.stringify(settings));
    newSettings.account.ethAccounts.push(newEthAccount);
    setSettings(newSettings);
  };

  const createContractAccount = (value: string): void => {
    const newContractAccount: ContractAccount = {
      id: uuidv4(),
      value: value,
    };
    const newSettings: Setting = JSON.parse(JSON.stringify(settings));
    newSettings.account.contractAccounts.push(newContractAccount);
    setSettings(newSettings);
  };

  const createBinanceAccount = (value: string): void => {
    const newBinanceAccount: BinanceAccount = {
      id: uuidv4(),
      value: value,
    };
    const newSettings: Setting = JSON.parse(JSON.stringify(settings));
    newSettings.account.binanceAccounts.push(newBinanceAccount);
    setSettings(newSettings);
  };

  const createKucoinAccount = (value: string, secret: string): void => {
    const newKucoinAccount: KucoinAccount = {
      id: uuidv4(),
      value: value,
      secret: secret,
    };
    const newSettings: Setting = JSON.parse(JSON.stringify(settings));
    newSettings.account.kucoinAccounts.push(newKucoinAccount);
    setSettings(newSettings);
  };

  // removeAccounts methods
  const removeEthAccount = (accountID: string): void => {
    const filteredEthAccounts = settings.account.ethAccounts.filter(
      (ethAccount) => {
        return ethAccount.id !== accountID;
      }
    );
    const newSettings: Setting = JSON.parse(JSON.stringify(settings));
    newSettings.account.ethAccounts = filteredEthAccounts;
    setSettings(newSettings);
  };

  const removeContractAccount = (accountID: string): void => {
    const filteredContarctAccounts = settings.account.contractAccounts.filter(
      (contractAccount) => {
        return contractAccount.id !== accountID;
      }
    );
    const newSettings: Setting = JSON.parse(JSON.stringify(settings));
    newSettings.account.contractAccounts = filteredContarctAccounts;
    setSettings(newSettings);
  };

  const removeBinanceAccount = (accountID: string): void => {
    const filteredBinanceAccounts = settings.account.binanceAccounts.filter(
      (binanceAccount) => {
        return binanceAccount.id !== accountID;
      }
    );
    const newSettings: Setting = JSON.parse(JSON.stringify(settings));
    newSettings.account.binanceAccounts = filteredBinanceAccounts;
    setSettings(newSettings);
  };

  const removeKucoinAccount = (accountID: string): void => {
    const filteredKucoinAccounts = settings.account.kucoinAccounts.filter(
      (kucoinAccount) => {
        return kucoinAccount.id !== accountID;
      }
    );
    const newSettings: Setting = JSON.parse(JSON.stringify(settings));
    newSettings.account.kucoinAccounts = filteredKucoinAccounts;
    setSettings(newSettings);
  };

  return (
    <div>
      <button
        className="btn btn-danger"
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
                <AccountAccordionComp
                  accordionAccountType={accountType.Binance}
                  accounts={settings.account.binanceAccounts}
                  newAccountHandler={createBinanceAccount}
                  removeHandler={removeBinanceAccount}
                />
                <AccountAccordionComp
                  accordionAccountType={accountType.Kucoin}
                  accounts={settings.account.kucoinAccounts}
                  newAccountHandler={createKucoinAccount}
                  removeHandler={removeKucoinAccount}
                />
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  saveAccounts();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComp;

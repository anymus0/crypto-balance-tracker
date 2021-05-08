import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuidv4 } from "uuid";
import React, { Dispatch, useState, SetStateAction, useEffect } from "react";
import styles from "../styles/Settings.module.scss";
import { Account, accountType } from "../models/Account";
import AccountComp from "./AccountComp";

// outside functions
const getAccountListFromLS = (): Account[] => {
  const accountList: Account[] = JSON.parse(
    localStorage.getItem("accountList")
  );
  return accountList;
};

const saveAccountListToLS = (accountList: Account[]): void => {
  localStorage.setItem("accountList", JSON.stringify(accountList));
};

// tsx templates
const emptyAccountList = <p>There are no accounts yet</p>;

// component
const SettingsComp = () => {
  // state variables
  const [accountList, setAccountList]: [
    Account[],
    Dispatch<SetStateAction<Account[]>>
  ] = useState([]);

  const [accountTypeForm, setAccountTypeForm]: [
    accountType,
    Dispatch<SetStateAction<accountType>>
  ] = useState(1);

  const [accountValueForm, setAccountValueForm]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState('');

  // inside functions
  const createNewAccount = (): Account => {
    const newAccount: Account = {
      id: uuidv4(),
      type: accountTypeForm,
      value: accountValueForm,
    };
    return newAccount;
  };

  const removeAccount = (accountID: string): void => {
    const filteredAccountList = accountList.filter((account) => {
      return account.id !== accountID;
    });
    setAccountList(filteredAccountList);
  };

  // run only on mount
  useEffect(() => {
    // get 'accountList' from localStorage if it was saved before
    if (getAccountListFromLS() !== null && window) {
      setAccountList(getAccountListFromLS());
    }
  }, []);

  return (
    <div id="settings">
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
              <div className="accountManager">
                <div className="container ps-0 pe-0">
                  <div className="row">
                    <div className="col-6">
                      <select
                        name="accountType"
                        id="accountType"
                        className="form-select"
                        value={accountTypeForm}
                        onChange={(formEvent) => {
                          setAccountTypeForm(formEvent.target.options.selectedIndex);
                        }}
                      >
                        <option value={accountType.Eth}>ETH wallet address</option>
                        <option value={accountType.Binance}>Binance API key</option>
                        <option value={accountType.Kucoin}>Kucoin API key</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        className="form-control"
                        value={accountValueForm}
                        onChange={(formEvent) => {setAccountValueForm(formEvent.target.value)}}
                      />
                    </div>
                    <div className="col-2">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setAccountList((accountList) => [
                            ...accountList,
                            createNewAccount(),
                          ]);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  <div className="row pt-4">
                    <div className="col">
                      {accountList.length === 0
                        ? emptyAccountList
                        : accountList.map((account) => (
                            <AccountComp
                              account={account}
                              key={account.id}
                              removeHandler={removeAccount}
                            />
                          ))}
                    </div>
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  saveAccountListToLS(accountList);
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComp;

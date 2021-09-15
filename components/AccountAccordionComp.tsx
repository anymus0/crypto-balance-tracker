import React, { Dispatch, useState, SetStateAction } from "react";
import AddedAccountComp from "./AddedAccountComp";
// models
import {
  EthAccount,
  ContractAccount,
  BinanceAccount,
  KucoinAccount,
  accountType,
} from "./../models/Account";

// component
const AccountAccordionComp = (props: {
  accordionAccountType: accountType;
  accounts: (EthAccount | ContractAccount | BinanceAccount | KucoinAccount)[];
  newAccountHandler: (value: string, secret?: string) => void;
  removeHandler: (accountID: string) => void;
}) => {

  // states
  const [accountInput, setAccountInput]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState("");

  const [accountSecondaryInput, setAccountSecondaryInput]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState("");

  return (
    <div className="accordion-item">
      <h2
        className="accordion-header"
        id={"flush-heading" + accountType[props.accordionAccountType]}
      >
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={
            "#flush-collapse" + accountType[props.accordionAccountType]
          }
          aria-expanded="false"
          aria-controls={
            "flush-collapse" + accountType[props.accordionAccountType]
          }
        >
          {accountType[props.accordionAccountType]}
        </button>
      </h2>
      <div
        id={"flush-collapse" + accountType[props.accordionAccountType]}
        className="accordion-collapse collapse"
        aria-labelledby={
          "flush-heading" + accountType[props.accordionAccountType]
        }
        data-bs-parent="#accordionFlushAccounts"
      >
        <div className="accordion-body">
          <div className="container">
            <div className="row pb-3">
              <div className="col">
                <input
                  type="text"
                  name={accountType[props.accordionAccountType] + "-input"}
                  id={accountType[props.accordionAccountType] + "Input"}
                  className="form-control"
                  onChange={(formEvent) => {
                    setAccountInput(formEvent.target.value);
                  }}
                  placeholder={
                    props.accordionAccountType !== accountType.EthWallet &&
                    props.accordionAccountType !== accountType.Contract
                      ? "API key"
                      : "Address"
                  }
                  value={accountInput}
                />
              </div>
              {props.accordionAccountType === accountType.Kucoin && (
                <div className="col">
                  <input
                    type="text"
                    name="kucoin-secret-input"
                    id="kucoinSecretInput"
                    className="form-control"
                    onChange={(formEvent) => {
                      setAccountSecondaryInput(formEvent.target.value);
                    }}
                    placeholder="Secret"
                    value={accountSecondaryInput}
                  />
                </div>
              )}
              <div className="col-2">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    props.newAccountHandler(accountInput, accountSecondaryInput);
                    setAccountInput("");
                    setAccountSecondaryInput("");
                  }}
                  disabled={
                    accountInput === "" ||
                    (props.accordionAccountType === accountType.Kucoin &&
                      accountSecondaryInput === "")
                  }
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                {props.accounts.map((account) => (
                  <AddedAccountComp
                    account={account}
                    key={account.id}
                    removeHandler={props.removeHandler}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountAccordionComp;

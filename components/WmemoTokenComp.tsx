import React, { Dispatch, useState, SetStateAction } from "react";
import { Token } from "../models/Account";
import styles from "../styles/TokenComp.module.scss";
import { formatCurrency } from "../formatCurrency";
import getTimeIndex from "./../web3Fetch/getTimeIndex";

// component
const WmemoTokenComp = (props: {
  token: Token;
  currency: string;
  walletAddress: string;
}) => {
  const formatDate = (rawDate: Date): string => {
    const formattedDate = new Date(rawDate).toLocaleTimeString();
    return formattedDate;
  };

  const [timeIndex, setTimeIndex]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);

  getTimeIndex().then((timeIndex) => {
    setTimeIndex(timeIndex);
  });

  return (
    <div>
      <div>
        <div className={`row ${styles.box}`}>
          <div className="col text-center pb-4">
            <img
              width={32}
              height={32}
              src={props.token.tokenData.image}
              alt="logo"
            />
            <h6 className="m-0">{props.token.symbol}</h6>
            <p>{props.token.balance.toFixed(8)}</p>
          </div>
          <div className="col-12 d-flex align-items-center justify-content-center">
            <p>{`Value: ${formatCurrency(
              props.token.balance * props.token.tokenData.currentPrice,
              props.currency
            )}`}</p>
          </div>
          <div className="col-12 d-flex align-items-center justify-content-center">
            <p>{`Market: ${formatCurrency(
              props.token.tokenData.currentPrice,
              props.currency
            )}`}</p>
          </div>
          <div className="col-12 d-flex align-items-center justify-content-center">
            <p>{`Market (MEMO): ${formatCurrency(
              (props.token.balance * props.token.tokenData.currentPrice) /
                (props.token.balance * timeIndex),
              props.currency
            )}`}</p>
          </div>
          <div className="col-12 d-flex align-items-center justify-content-center">
            <p>{`Balance (MEMO): ${(
              props.token.balance * timeIndex
            ).toPrecision(8)}`}</p>
          </div>
          <div className="col-12 d-flex align-items-center justify-content-center">
            <button
              className="btn btn-primary shadow-lg mt-2"
              data-bs-toggle="modal"
              data-bs-target={`#${props.token.symbol}-${props.walletAddress}-Modal`}
            >
              Details
            </button>
          </div>
        </div>
        {/* <!-- Modal --> */}
        <div
          className={`modal fade ${styles.tokenModal}`}
          id={`${props.token.symbol}-${props.walletAddress}-Modal`}
          tabIndex={-1}
          aria-labelledby={`${props.token.symbol}-${props.walletAddress}-ModalLabel`}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id={`${props.token.symbol}-${props.walletAddress}-ModalLabel`}
                >
                  {props.token.symbol}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>{`Balance: ${props.token.balance} ${props.token.symbol}`}</p>
                <hr />
                <p>{`Balance (MEMO): ${
                  props.token.balance * timeIndex
                } MEMO`}</p>
                <hr />
                <p>
                  {`Value: ${formatCurrency(
                    props.token.balance * props.token.tokenData.currentPrice,
                    props.currency
                  )}`}
                </p>
                <hr />
                <p>{`Market Price: ${formatCurrency(
                  props.token.tokenData.currentPrice,
                  props.currency
                )}`}</p>
                <hr />
                <p>{`Market Price (MEMO): ${formatCurrency(
                  (props.token.balance * props.token.tokenData.currentPrice) /
                    (props.token.balance * timeIndex),
                  props.currency
                )}`}</p>
                <hr />
                <p>
                  {`24h change: ${props.token.tokenData.dailyPercentageChange.toFixed(
                    2
                  )}%`}
                </p>
                <hr />
                <p>
                  Last updated: {formatDate(props.token.tokenData.lastUpdated)}
                </p>
                <hr />
                <p className="text-start">
                  More info{" "}
                  <strong>
                    <a
                      className="link-light text-decoration-underline"
                      href={props.token.tokenData.moreInfoUrl}
                      target="alt_"
                    >
                      here
                    </a>
                  </strong>
                </p>
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
    </div>
  );
};

export default WmemoTokenComp;

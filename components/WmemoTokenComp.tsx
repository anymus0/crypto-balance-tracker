import React, {
  Dispatch,
  useState,
  SetStateAction,
  useEffect,
  Context,
} from "react";import { Token } from "../models/Account";
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

  const [wMEMOPrice, setWMEMOPrice]: [number, Dispatch<SetStateAction<number>>] =
  useState(0);

  const [balanceValue, setBalanceValue]: [number, Dispatch<SetStateAction<number>>] =
  useState(0);

  const [timeIndex, setTimeIndex]: [number, Dispatch<SetStateAction<number>>] =
  useState(0);

  getTimeIndex().then((timeIndex) => {
    setWMEMOPrice(timeIndex * props.token.tokenData.result.current_price);
    setBalanceValue(wMEMOPrice * props.token.balance);
    setTimeIndex(timeIndex);
  });

  return (
    <div>
      {wMEMOPrice !== 0 && (
        <div>
          <div className={`row ${styles.box}`}>
            <div className="col text-center pb-4">
              <img
                width={32}
                height={32}
                src={props.token.tokenData.result.image}
                alt="logo"
              />
              <h6 className="m-0">{props.token.symbol}</h6>
              <p>{props.token.balance.toFixed(8)}</p>
            </div>
            <div className="col-12 d-flex align-items-center justify-content-center">
              <p>
                {`Value: ${formatCurrency(
                  balanceValue,
                  props.currency
                )}`}
              </p>
            </div>
            <div className="col-12 d-flex align-items-center justify-content-center">
              <p>{`Market: ${formatCurrency(wMEMOPrice, props.currency)}`}</p>
            </div>
            <div className="col-12 d-flex align-items-center justify-content-center">
              <p>{`Market (MEMO): ${formatCurrency(props.token.tokenData.result.current_price, props.currency)}`}</p>
            </div>
            <div className="col-12 d-flex align-items-center justify-content-center">
              <p>{`Balance (MEMO): ${(balanceValue / props.token.tokenData.result.current_price).toPrecision(8)}`}</p>
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
                  <p>{`Balance (MEMO): ${props.token.balance * timeIndex} MEMO`}</p>
                  <hr />
                  <p>
                    {`Value: ${formatCurrency(
                      props.token.balance *
                      wMEMOPrice,
                      props.currency
                    )}`}
                  </p>
                  <hr />
                  <p>{`Market Price: ${formatCurrency(
                    wMEMOPrice,
                    props.currency
                  )}`}</p>
                  <hr />
                  <p>{`Market Price (MEMO): ${formatCurrency(
                    props.token.tokenData.result.current_price,
                    props.currency
                  )}`}</p>
                  <hr />
                  <p>
                    {`24h change: ${props.token.tokenData.result.price_change_percentage_24h.toFixed(
                      2
                    )}%`}
                  </p>
                  <hr />
                  <p>
                    Last updated:{" "}
                    {formatDate(props.token.tokenData.result.last_updated)}
                  </p>
                  <hr />
                  <p className="text-start">
                    More info on{" "}
                    <strong>
                      <a
                        className="link-light text-decoration-underline"
                        href={`https://www.coingecko.com/en/coins/${props.token.tokenData.result.id}`}
                        target="alt_"
                      >
                        CoinGecko
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
      )}
    </div>
  );
};

export default WmemoTokenComp;
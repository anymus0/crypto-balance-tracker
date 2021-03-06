import { Token } from "../models/Account";
import styles from "../styles/TokenComp.module.scss";
import { formatCurrency } from "../formatCurrency";

// component
const TokenComp = (props: {
  token: Token;
  currency: string;
  walletAddress: string;
}) => {
  const formatDate = (rawDate: Date): string => {
    const formattedDate = new Date(rawDate).toLocaleTimeString();
    return formattedDate;
  };

  return (
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
          <p>
            {`Value: ${formatCurrency(
              props.token.balance * props.token.tokenData.currentPrice,
              props.token.tokenData.currency
            )}`}
          </p>
        </div>
        <div className="col-12 d-flex align-items-center justify-content-center">
          <p>
            {`Market: ${formatCurrency(
              props.token.tokenData.currentPrice,
              props.currency
            )}`}
          </p>
        </div>
        <div className="col-12 d-flex align-items-center justify-content-center">
          <button
            className="btn btn-primary shadow-lg mt-2"
            data-bs-toggle="modal"
            data-bs-target={`#${props.token.symbol.replaceAll(".", "")}-${
              props.walletAddress
            }-Modal`}
          >
            Details
          </button>
        </div>
      </div>
      {/* <!-- Modal --> */}
      <div
        className={`modal fade ${styles.tokenModal}`}
        id={`${props.token.symbol.replaceAll(".", "")}-${
          props.walletAddress
        }-Modal`}
        tabIndex={-1}
        aria-labelledby={`${props.token.symbol.replaceAll(".", "")}-${
          props.walletAddress
        }-ModalLabel`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`${props.token.symbol.replaceAll(".", "")}-${
                  props.walletAddress
                }-ModalLabel`}
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
              <p>
                {`24h change: ${props.token.tokenData.dailyPercentageChange.toFixed(
                  2
                )}%`}
              </p>
              <hr />
              <p>
                Last updated:{" "}
                {formatDate(props.token.tokenData.lastUpdated)}
              </p>
              <hr />
              <p className="text-start">
                More info {" "}
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
  );
};

export default TokenComp;

import { Token } from "../models/Account";
import styles from "../styles/TokenComp.module.scss";
import { formatCurrency } from "../formatCurrency";

// component
const TokenTableRowComp = (props: {
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
        <div className="col text-center">
          <img
            width={32}
            height={32}
            src={props.token.tokenData.result.image}
            alt="logo"
          />
          <h6 className="m-0">{props.token.symbol}</h6>
          <p>{props.token.balance.toFixed(3)}</p>
        </div>
        <div className="col d-flex align-items-center">
          <p>
            {formatCurrency(
              props.token.balance * props.token.tokenData.result.current_price,
              props.currency
            )}
          </p>
        </div>
        <div className="col d-flex align-items-center justify-content-center">
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
              <p>{`Balance: ${props.token.balance.toFixed(5)} ${
                props.token.symbol
              }`}</p>
              <hr />
              <p>
                {`Value: ${formatCurrency(
                  props.token.balance * props.token.tokenData.result.current_price,
                  props.currency
                )}`}
              </p>
              <hr />
              <p>{`Market Price: ${formatCurrency(
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
                Last updated: {formatDate(props.token.tokenData.result.last_updated)}
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
  );
};

export default TokenTableRowComp;

import { Token } from "../models/Account";
import styles from "../styles/TokenComp.module.scss";
import { formatCurrency } from "./../formatCurrency";

// component
const TokenComp = (props: { token: Token; currency: string }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center">
            <p>{props.token.symbol}</p>
          </div>
          <div
            className={`col-12 bg-primary-light rounded-3 text-primary-dark ${styles.box}`}
          >
            <p>{`Balance: ${props.token.balance.toFixed(4)}`}</p>
            <p>
              {`Value: ${formatCurrency(
                props.token.balance * props.token.tokenData.current_price,
                props.currency
              )}`}
            </p>
            <p>
              {`Price: ${formatCurrency(
                props.token.tokenData.current_price,
                props.currency
              )}`}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default TokenComp;

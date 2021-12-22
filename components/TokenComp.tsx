import { Token } from "../models/Account";
import styles from "../styles/TokenComp.module.scss";
import { formatCurrency } from "../formatCurrency";

// component
const TokenTableRowComp = (props: { token: Token; currency: string }) => {
  return (
    <div className={`row ${styles.box}`}>
      <div className="col text-center">
        <img
          width={32}
          height={32}
          src={props.token.tokenData.image}
          alt="logo"
        />
        <h6>{props.token.symbol}</h6>
        <p>{props.token.balance.toFixed(3)}</p>
      </div>
      <div className="col d-flex align-items-center">
        <p>
          {formatCurrency(
            props.token.balance * props.token.tokenData.current_price,
            props.currency
          )}
        </p>
      </div>
      <div className="col d-flex align-items-center justify-content-center">
        <button className="btn btn-primary shadow-lg mt-2">Details</button>
      </div>
    </div>
  );
};

export default TokenTableRowComp;

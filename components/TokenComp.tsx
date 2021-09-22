import { Token } from "../models/Account";
import styles from "../styles/TokenComp.module.scss";
import { formatCurrency } from './../formatCurrency';

// component
const TokenComp = (props: { token: Token }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {props.token.symbol}
      <span className={`${styles.badgeFont} badge bg-primary-light`}>
        {props.token.balance.toFixed(4)}
        <br />
        {formatCurrency(
          props.token.balance * props.token.tokenData.current_price
        )}
        <br />
        {`1 = ${formatCurrency(props.token.tokenData.current_price)}`}
      </span>
    </li>
  );
};

export default TokenComp;

import { Token } from "../models/Account";
import styles from "../styles/TokenComp.module.scss";
import { formatCurrency } from "../formatCurrency";

// component
const TokenTableRowComp = (props: { token: Token; currency: string }) => {
  return (
    <tr>
      <td>
        <p>{props.token.symbol}</p>
      </td>
      <td>
        <p>{props.token.balance.toFixed(3)}</p>
      </td>
      <td>
        <p>
          {formatCurrency(
            props.token.balance * props.token.tokenData.current_price,
            props.currency
          )}
        </p>
      </td>
      <td>
        <p>
          {formatCurrency(props.token.tokenData.current_price, props.currency)}
        </p>
      </td>
    </tr>
  );
};

export default TokenTableRowComp;

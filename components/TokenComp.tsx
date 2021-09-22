import { Token } from "../models/Account";

// component
const TokenComp = (props: { token: Token }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {props.token.symbol}
      <span className="badge bg-primary-light">
        {props.token.balance.toFixed(4)}
        <br />
        {(props.token.balance * props.token.tokenData.current_price).toFixed(2)}
        $
        <br />
        {`1 = ${props.token.tokenData.current_price}$`}
      </span>
    </li>
  );
};

export default TokenComp;

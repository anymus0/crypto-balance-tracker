import { Token } from "../models/Account";

// component
const TokenComp = (props: { token: Token }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {props.token.symbol}
      <span className="badge bg-primary rounded-pill">
        {props.token.balance}
      </span>
    </li>
  );
};

export default TokenComp;

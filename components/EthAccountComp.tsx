import { EthAccount } from "../models/Account";
import { Setting } from "./../models/Setting"
import styles from "../styles/EthAccountComp.module.scss";
import TokenComp from "./TokenComp";

// component
const EthAccountComp = (props: { account: EthAccount, currency: string }) => {
  return (
    <div>
      <div className={`card ${styles.accountCard}`}>
        <div className="card-body shadow-lg">
          <h6 className="card-title text-muted">
            {props.account.value.slice(0, 8)}...
          </h6>
          {props.account.tokens !== undefined &&
            props.account.tokens.length > 0 && (
              <ul className="list-group">
                {props.account.tokens.map((token, index) => (
                  <TokenComp token={token} key={index} currency={props.currency} />
                ))}
              </ul>
            )}
        </div>
      </div>
    </div>
  );
};

export default EthAccountComp;

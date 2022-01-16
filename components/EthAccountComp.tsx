import { EthAccount } from "../models/Account";
import styles from "../styles/EthAccountComp.module.scss";
import TokenComp from "./TokenComp";
import WmemoTokenComp from "./WmemoTokenComp";

// component
const EthAccountComp = (props: { account: EthAccount; currency: string }) => {
  return (
    <div
      className={`shadow-lg bg-secondary-dark p-2 rounded border border-3 border-light ${styles.accountCard}`}
    >
      <h6 className="text-muted">{props.account.value.slice(0, 8)}...</h6>
      {props.account.tokens !== undefined && props.account.tokens.length > 0 && (
        <div className="container-fluid p-2">
          {props.account.tokens.map((token, index) => {
            if (token.symbol === "wMEMO") {
              return (
                <WmemoTokenComp
                  token={token}
                  currency={props.currency}
                  walletAddress={props.account.value}
                  key={index}
                ></WmemoTokenComp>
              );
            } else {
              return (
                <TokenComp
                  token={token}
                  currency={props.currency}
                  walletAddress={props.account.value}
                  key={index}
                ></TokenComp>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default EthAccountComp;

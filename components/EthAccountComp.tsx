import { EthAccount } from "../models/Account";
import styles from "../styles/EthAccountComp.module.scss";
import TokenTableRowComp from "./TokenTableRowComp";

// component
const EthAccountComp = (props: { account: EthAccount; currency: string }) => {
  return (
    <div className={`shadow-lg bg-secondary-dark p-2 rounded border border-3 border-light ${styles.accountCard}`}>
      <h6 className="text-muted">{props.account.value.slice(0, 8)}...</h6>
      {props.account.tokens !== undefined && props.account.tokens.length > 0 && (
        <table className={`table table-borderless ${styles.tableDark}`}>
          <thead>
            <tr>
              <th>
                <p>Token</p>
              </th>
              <th>
                <p>Balance</p>
              </th>
              <th>
                <p>Value</p>
              </th>
              <th>
                <p>Price</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.account.tokens.map((token, index) => (
              <TokenTableRowComp
                token={token}
                key={index}
                currency={props.currency}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EthAccountComp;

import { EthAccount } from '../models/EthAccount';
import styles from '../styles/EthAccountComp.module.scss';

// component
const EthAccountComp = (props: {account: EthAccount}) => {
  return (
    <div>
      <div className={`card ${styles.accountCard}`}>
        <div className="card-body shadow-lg">
          <h6 className="card-title text-muted">{props.account.address.slice(0, 8)}...</h6>
          <p className="card-text">{props.account.balance} <strong>ETH</strong></p>
        </div>
      </div>
    </div>
  )}

export default EthAccountComp;

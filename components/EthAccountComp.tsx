import { EthAccount } from '../models/EthAccount';

// component
const EthAccountComp = (props: {account: EthAccount}) => {
  return (
    <div>
      <h2>{props.account.balance}</h2>
    </div>
  )}

export default EthAccountComp;

// models
import { EthAccount, ContractAccount, BinanceAccount, KucoinAccount } from './../models/Account';

// component
const AccountComp = (props: {
  account: (EthAccount | ContractAccount | BinanceAccount | KucoinAccount);
  removeHandler: (accountID: string) => void;
}) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <p>{props.account.value.slice(0, 12)}...</p>
        </div>
        <div className="col">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              props.removeHandler(props.account.id)
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountComp;

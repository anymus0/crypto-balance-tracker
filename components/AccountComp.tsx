import { Account, accountType } from "../models/Account";

// component
const AccountComp = (props: {
  account: Account;
  removeHandler: (accountID: string) => void;
}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p>Type: {accountType[props.account.type]}</p>
        </div>
        <div className="col">
          <p>Address: {props.account.value}</p>
        </div>
        <div className="col">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              props.removeHandler(props.account.id)
            }}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountComp;

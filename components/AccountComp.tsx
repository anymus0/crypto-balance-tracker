import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Account, accountType } from "../models/Account";

// component
const AccountComp = (props: {
  account: Account;
  removeHandler: (accountID: string) => void;
}) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-5">
          <p>{accountType[props.account.type]}</p>
        </div>
        <div className="col">
          <p>{props.account.value}</p>
        </div>
        <div className="col-1">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              props.removeHandler(props.account.id)
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountComp;

import { EthAccount } from "./../models/Account";
import { formatCurrency } from "./../formatCurrency";

// net worth aggregate function
const getEthNetWorth = (ethAccounts: EthAccount[]) => {
  try {
    let netWorth = 0;
    for (let i = 0; i < ethAccounts.length; i++) {
      for (let j = 0; j < ethAccounts[i].tokens.length; j++) {
        const balance = ethAccounts[i].tokens[j].balance;
        const value = ethAccounts[i].tokens[j].tokenData.result.current_price;
        netWorth += balance * value;
      }
    }
    return parseInt(netWorth.toFixed(2));
  } catch (error) {
    console.error(error);
  }
};

// component
const NetWorthComp = (props: {
  ethAccounts: EthAccount[];
  currency: string;
}) => {
  return (
    <div className="row">
      <div className="col-lg-3 col-md-12">
        {getEthNetWorth(props.ethAccounts) > 0 && (
          <p>
            Net Worth:{" "}
            {formatCurrency(getEthNetWorth(props.ethAccounts), props.currency)}
          </p>
        )}
      </div>
    </div>
  );
};

export default NetWorthComp;

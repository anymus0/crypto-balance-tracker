import { EthAccount } from "./../models/Account";
import { formatCurrency } from "./../formatCurrency";

// net worth aggregate function
const getEthNetWorth = (ethAccounts: EthAccount[]) => {
  let netWorth = 0;
  for (let i = 0; i < ethAccounts.length; i++) {
    for (let j = 0; j < ethAccounts[i].tokens.length; j++) {
      const balance = ethAccounts[i].tokens[j].balance;
      const value = ethAccounts[i].tokens[j].tokenData.current_price;
      netWorth += balance * value;
    }
  }
  return parseInt(netWorth.toFixed(2));
};

const getEthNetWorthWithoutOHM = (ethAccounts: EthAccount[]) => {
  let netWorth = 0;
  for (let i = 0; i < ethAccounts.length; i++) {
    for (let j = 0; j < ethAccounts[i].tokens.length; j++) {
      const balance = ethAccounts[i].tokens[j].balance;
      const value = ethAccounts[i].tokens[j].tokenData.current_price;
      if (
        ethAccounts[i].tokens[j].symbol !== "OHM" &&
        ethAccounts[i].tokens[j].symbol !== "sOHM"
      ) {
        netWorth += balance * value;
      }
    }
  }
  return parseInt(netWorth.toFixed(2));
};

// component
const NetWorthComp = (props: { ethAccounts: EthAccount[], currency: string }) => {
  return (
    <div className="row">
      <div className="col-lg-3 col-md-12">
        {getEthNetWorth(props.ethAccounts) > 0 && (
          <p>Net Worth: {formatCurrency(getEthNetWorth(props.ethAccounts), props.currency)}</p>
        )}
      </div>
      <div className="col-lg-3 col-md-12">
        {getEthNetWorthWithoutOHM(props.ethAccounts) > 0 && (
          <p>
            Net Worth w/o OHM: {formatCurrency(getEthNetWorthWithoutOHM(props.ethAccounts), props.currency)}
          </p>
        )}
      </div>
    </div>
  );
};

export default NetWorthComp;

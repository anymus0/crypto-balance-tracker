import { EthAccount } from "./../models/Account";

// net worth aggregate fucntion
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
const NetWorthComp = (props: { ethAccounts: EthAccount[] }) => {
  return (
    <div className="row">
      <div className="col-3">
        {getEthNetWorth(props.ethAccounts) > 0 && (
          <p>Net Worth: {getEthNetWorth(props.ethAccounts)}$</p>
        )}
      </div>
      <div className="col">
        {getEthNetWorthWithoutOHM(props.ethAccounts) > 0 && (
          <p>
            Net Worth Without OHM: {getEthNetWorthWithoutOHM(props.ethAccounts)}
            $
          </p>
        )}
      </div>
    </div>
  );
};

export default NetWorthComp;

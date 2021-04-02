const AccountManager = () => {
  return (
    <div className="accountManager">
      <div className="container ps-0">
        <div className="row">
          <div className="col-6">
            <select name="accountType" id="accountType" className="form-select">
              <option value="binance">ETH wallet address</option>
              <option value="binance">Binance API key</option>
            </select>
          </div>
          <div className="col-4">
            <input type="text" className="form-control" />
          </div>
          <div className="col-2">
            <button className="btn btn-success">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManager;

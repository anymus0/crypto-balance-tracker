const CurrencyComp = (props: { currentCurrency: string, setCurrencyHandler(newCurrency: string): void }) => {
  const currencyList: Array<string> = ['USD', 'EUR', 'HUF', 'GBP', 'JPY'];
  return (
    <div>
      <p>Currency</p>
      <select className="form-select" aria-label="Currency selection" value={props.currentCurrency} onChange={(formEvent) => {
        props.setCurrencyHandler(formEvent.target.value);
      }}>
        {currencyList.map(currency => 
          <option key={currency} value={currency}>{currency}</option>
        )}
      </select>
    </div>
  );
}

export default CurrencyComp;
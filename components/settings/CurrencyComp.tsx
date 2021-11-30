const CurrencyComp = (props: { currency: string, setCurrencyHandler(newCurrency: string): void }) => {
  return (
    <div>
      <p>Currency</p>
      <select className="form-select" aria-label="Currency selection" onChange={(formEvent) => {
        props.setCurrencyHandler(formEvent.target.value);
      }}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="HUF">HUF</option>
        <option value="GBP">GBP</option>
      </select>
    </div>
  );
}

export default CurrencyComp;
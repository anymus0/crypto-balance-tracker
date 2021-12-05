export const formatCurrency = (money: number, currency: string) => {
  try {
    return new Intl.NumberFormat("hu", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
      currencyDisplay: "narrowSymbol"
    }).format(money);
  } catch (error) {
    console.error(error)
  }
};

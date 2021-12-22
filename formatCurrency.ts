export const formatCurrency = (money: number, currency: string) => {
  try {
    const formattedNumber = new Intl.NumberFormat("hu", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
      currencyDisplay: "narrowSymbol",
    }).format(money)
    return formattedNumber;
  } catch (error) {
    console.error(error)
  }
};

export const formatCurrency = (money: number, currency: string) => {
  try {
    console.log(currency);
    return new Intl.NumberFormat("hu", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(money);
  } catch (error) {
    console.error(error)
  }
};

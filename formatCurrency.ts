export const formatCurrency = (money: number, currency: string) => {
  return new Intl.NumberFormat("hu", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(money);
};

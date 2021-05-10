import { CryptocurrencyData } from "./models/CryptocurrencyData";

export const fetchEthData = async () => {
  const coingeckoAPI = "https://api.coingecko.com/api/v3";
  const ethDataRes = await fetch(
    `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=ethereum`
  );
  const ethData: CryptocurrencyData[] = await ethDataRes.json();
  return ethData;
};

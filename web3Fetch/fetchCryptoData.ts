import {
  CryptocurrencyDataResponse,
  CryptocurrencyData,
} from "../models/CryptocurrencyData";

export const fetchCryptoData = async (
  name: string,
  symbol: string,
  currency: string
) => {
  try {
    // rename token names to match CoinGecko the API id
    if (name === "MEMOries") {
      name = "Wonderland";
    }
    if (name === "THOR v2") {
      name = "thor";
    }
    if (name === "Wrapped MEMO") {
      name = "Wonderland";
    }
    const coingeckoAPI = "https://api.coingecko.com/api/v3";
    const fetchURLByName = `${coingeckoAPI}/coins/markets?vs_currency=${currency}&ids=${name.toLowerCase()}`;
    const resByName = await fetch(fetchURLByName);
    const CryptocurrencyDataByName: CryptocurrencyData[] =
      await resByName.json();
    // if fetching by name returns no data, then try fetching by symbol
    if (
      CryptocurrencyDataByName.length === 0 ||
      CryptocurrencyDataByName === null ||
      CryptocurrencyDataByName === undefined
    ) {
      const fetchURLBySymbol = `${coingeckoAPI}/coins/markets?vs_currency=${currency}&symbols=${symbol.toLowerCase()}`;
      const resBySymbol = await fetch(fetchURLBySymbol);
      const CryptocurrencyDataBySymbol: CryptocurrencyData[] =
        await resBySymbol.json();
      const CryptocurrencyDataResponseBySymbol: CryptocurrencyDataResponse = {
        success: true,
        result: CryptocurrencyDataBySymbol[0],
      };
      return CryptocurrencyDataResponseBySymbol;
    } else {
      const CryptocurrencyDataResponseByName: CryptocurrencyDataResponse = {
        success: true,
        result: CryptocurrencyDataByName[0],
      };
      return CryptocurrencyDataResponseByName;
    }
  } catch (error) {
    console.error(error);
    const CryptocurrencyDataResponseFail: CryptocurrencyDataResponse = {
      success: false,
      result: null,
    };
    return CryptocurrencyDataResponseFail;
  }
};

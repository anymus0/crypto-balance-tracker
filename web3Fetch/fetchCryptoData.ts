import {
  CryptocurrencyDataCoinGeckoResponse,
  CryptocurrencyDataCoinGecko,
  CryptocurrencyDataDexResponse,
  CryptocurrencyData,
} from "../models/CryptocurrencyData";

const fetchCryptoDataCoinGecko = async (name: string, symbol: string) => {
  try {
    if (name === "Dai Stablecoin") {
      name = "dai";
    }
    if (name === "USD Coin") {
      name = "usd-coin";
    }
    if (name === "Tether USD") {
      name = "tether";
    }
    if (name === "Magic Internet Money") {
      name = "magic-internet-money";
    }
    const coingeckoAPI = "https://api.coingecko.com/api/v3";
    const fetchURLByName = `${coingeckoAPI}/coins/markets?vs_currency=usd&ids=${name.toLowerCase()}`;
    const resByName = await fetch(fetchURLByName);
    const CryptocurrencyDataByName: CryptocurrencyDataCoinGecko[] =
      await resByName.json();
    // if fetching by name returns no data, then try fetching by symbol
    if (
      CryptocurrencyDataByName.length === 0 ||
      CryptocurrencyDataByName === null ||
      CryptocurrencyDataByName === undefined
    ) {
      const fetchURLBySymbol = `${coingeckoAPI}/coins/markets?vs_currency=usd&symbols=${symbol.toLowerCase()}`;
      const resBySymbol = await fetch(fetchURLBySymbol);
      const CryptocurrencyDataBySymbol: CryptocurrencyDataCoinGecko[] =
        await resBySymbol.json();
      if (
        CryptocurrencyDataBySymbol.length === 0 ||
        CryptocurrencyDataBySymbol === undefined
      )
        throw `Token "${symbol}" was not found on CoinGecko!`;
      const CryptocurrencyDataResponseBySymbol: CryptocurrencyDataCoinGeckoResponse =
        {
          success: true,
          result: CryptocurrencyDataBySymbol[0],
        };
      return CryptocurrencyDataResponseBySymbol;
    } else {
      if (
        CryptocurrencyDataByName.length === 0 ||
        CryptocurrencyDataByName === undefined
      )
        throw `Token "${name}" was not found on CoinGecko!`;
      const CryptocurrencyDataResponseByName: CryptocurrencyDataCoinGeckoResponse =
        {
          success: true,
          result: CryptocurrencyDataByName[0],
        };
      return CryptocurrencyDataResponseByName;
    }
  } catch (error) {
    console.error(error);
    const CryptocurrencyDataResponseFail: CryptocurrencyDataCoinGeckoResponse =
      {
        success: false,
        result: null,
      };
    return CryptocurrencyDataResponseFail;
  }
};

const fetchCryptoDataDex = async (contractAddress: string) => {
  try {
    const dexScreenerFetch = await fetch(
      `https://api.dexscreener.io/latest/dex/tokens/${contractAddress}`
    );
    if (dexScreenerFetch.status === 400)
      throw `Token "${contractAddress}" was not found on DexScreener!`;
    const dexScreenerRes: CryptocurrencyDataDexResponse =
      await dexScreenerFetch.json();
    if (
      dexScreenerRes.pairs === undefined ||
      dexScreenerRes.pairs === null ||
      dexScreenerRes.pairs.length === 0
    )
      throw `Token pair was not found for "${contractAddress}"!`;
    return dexScreenerRes;
  } catch (error) {
    console.error(error);
    const CryptocurrencyDataResponseFail: CryptocurrencyDataDexResponse = {
      schemaVersion: null,
      pairs: null,
    };
    return CryptocurrencyDataResponseFail;
  }
};

const fetchCurrencyExchangeRate = async (currency: string) => {
  try {
    const coingeckoAPI = "https://api.coingecko.com/api/v3";
    const fetchUsdcUrl = `${coingeckoAPI}/coins/markets?vs_currency=${currency}&ids=usd-coin`;
    const resUsdc = await fetch(fetchUsdcUrl);
    const CryptocurrencyDataUsdc: CryptocurrencyDataCoinGecko[] =
      await resUsdc.json();
    const CryptocurrencyDataUsdcRes: CryptocurrencyDataCoinGeckoResponse = {
      success: true,
      result: CryptocurrencyDataUsdc[0],
    };
    return CryptocurrencyDataUsdcRes;
  } catch (error) {
    console.error(error);
    const CryptocurrencyDataResponseFail: CryptocurrencyDataCoinGeckoResponse =
      {
        success: false,
        result: null,
      };
    return CryptocurrencyDataResponseFail;
  }
};

export const fetchCryptoData = async (
  name: string,
  symbol: string,
  currency: string,
  contractAddress: string
) => {
  try {
    // exchange rate
    const currencyExchangeRate = await fetchCurrencyExchangeRate(currency);
    // if currency fetch fails, default to USD
    const exchangeRateToUsd = currencyExchangeRate.success
      ? currencyExchangeRate.result.current_price
      : 1;
    currency = currencyExchangeRate.success ? currency : "USD";

    // fetch crypto datas from CoinGecko & DexScreener
    const cryptoDataCoinGecko = await fetchCryptoDataCoinGecko(name, symbol);
    const cryptoDataDex = await fetchCryptoDataDex(contractAddress);

    const cryptoData: CryptocurrencyData = {
      currentPrice: null,
      dailyPercentageChange: null,
      lastUpdated: new Date(),
      currency: currency,
      moreInfoUrl: null,
      image: null,
    };
    // if Dex fetch failed, default to CoinGecko
    if (cryptoDataDex.pairs === null) {
      cryptoData.currentPrice =
        cryptoDataCoinGecko.result.current_price * exchangeRateToUsd;
      cryptoData.dailyPercentageChange =
        cryptoDataCoinGecko.result.price_change_percentage_24h;
      cryptoData.lastUpdated = cryptoDataCoinGecko.result.last_updated;
      cryptoData.moreInfoUrl = `https://www.coingecko.com/en/coins/${cryptoDataCoinGecko.result.id}`;
      cryptoData.image = cryptoDataCoinGecko.result.image;
    } else {
      cryptoData.currentPrice =
        Number.parseFloat(cryptoDataDex.pairs[0].priceUsd) * exchangeRateToUsd;
      cryptoData.dailyPercentageChange = cryptoDataDex.pairs[0].priceChange.h24;
      cryptoData.moreInfoUrl = cryptoDataDex.pairs[0].url;
      cryptoData.image =
        cryptoDataCoinGecko.success === false
          ? "https://lagoon1.lagooncompany.xyz/node.png"
          : cryptoDataCoinGecko.result.image;
    }
    return cryptoData;
  } catch (error) {
    console.error(error);
    const cryptoData: CryptocurrencyData = {
      currentPrice: null,
      dailyPercentageChange: null,
      lastUpdated: null,
      currency: null,
      moreInfoUrl: null,
      image: null,
    };
    return cryptoData;
  }
};

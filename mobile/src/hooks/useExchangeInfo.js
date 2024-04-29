import useSWR from 'swr';
export const EXCHANGE_INFO_ENDPOINT =
  'https://api.binance.com/api/v3/exchangeInfo';

const fetcher = url => fetch(url).then(res => res.json());

export function useExchangeInfo() {
  const exchangeInfo = useSWR(EXCHANGE_INFO_ENDPOINT, fetcher);
  const map = Object.fromEntries(
    (exchangeInfo.data?.symbols ?? []).map(x => [x.symbol, x]),
  );
  return {
    ...exchangeInfo,
    map,
  };
}

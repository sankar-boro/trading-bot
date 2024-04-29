import useSWR from 'swr';
export const TICKER_24HR_ENDPOINT =
  'https://api.binance.com/api/v3/ticker/24hr';

const fetcher = url => fetch(url).then(res => res.json());

export function use24HrTicker() {
  const tick = useSWR(TICKER_24HR_ENDPOINT, fetcher);
  return {
    ...tick,
    map: Object.fromEntries((tick.data ?? []).map(v => [v.symbol, v])),
  };
}

export const TICKERS = [
  'PG',
  'TGT',
  'BRG'
]
export const MARKET_OPENED_DAYS = 250
export const TICKER_QUERY = ticker => {
  return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=full&apikey=H5HKBN46EVDYZBZ2`
}

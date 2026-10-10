// Real-time market data from Binance API
// Last updated: 2026-03-06 08:05:43

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  quoteVolume: number;
  high: number;
  low: number;
  open: number;
  weightedAvgPrice: number;
  count: number;
  timestamp: string;
  data: { time: string; value: number }[];
}

// Real market data from Binance (2026-03-06 08:05:43)
export const realMarketAssets: MarketAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 70885.96,
    priceChange: -1782.67,
    priceChangePercent: -2.453,
    volume: 26466.17,
    quoteVolume: 1908374000,
    high: 73558.15,
    low: 70645.47,
    open: 72668.63,
    weightedAvgPrice: 72106.18,
    count: 6692398,
    timestamp: '2026-03-06 08:05:43',
    data: [], // Will be populated with chart data
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2074.36,
    priceChange: -51.38,
    priceChangePercent: -2.417,
    volume: 431517.0,
    quoteVolume: 908188700,
    high: 2163.66,
    low: 2054.75,
    open: 2125.74,
    weightedAvgPrice: 2104.64,
    count: 6737734,
    timestamp: '2026-03-06 08:05:43',
    data: [],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 88.87,
    priceChange: -2.11,
    priceChangePercent: -2.319,
    volume: 3746209.0,
    quoteVolume: 337687800,
    high: 92.96,
    low: 87.91,
    open: 90.98,
    weightedAvgPrice: 90.14,
    count: 1556188,
    timestamp: '2026-03-06 08:05:43',
    data: [],
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.269,
    priceChange: -0.0059,
    priceChangePercent: -2.146,
    volume: 147048400.0,
    quoteVolume: 40054950,
    high: 0.278,
    low: 0.2651,
    open: 0.2749,
    weightedAvgPrice: 0.2724,
    count: 177092,
    timestamp: '2026-03-06 08:05:43',
    data: [],
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    price: 1.531,
    priceChange: -0.004,
    priceChangePercent: -0.261,
    volume: 6106350.0,
    quoteVolume: 9310211,
    high: 1.556,
    low: 1.482,
    open: 1.535,
    weightedAvgPrice: 1.5247,
    count: 74138,
    timestamp: '2026-03-06 08:05:43',
    data: [],
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: 648.13,
    priceChange: -9.66,
    priceChangePercent: -1.469,
    volume: 127520.3,
    quoteVolume: 83395680,
    high: 665.42,
    low: 646.14,
    open: 657.79,
    weightedAvgPrice: 653.98,
    count: 951052,
    timestamp: '2026-03-06 08:05:43',
    data: [],
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    price: 1.4057,
    priceChange: -0.0226,
    priceChangePercent: -1.582,
    volume: 117845700.0,
    quoteVolume: 167604100,
    high: 1.4525,
    low: 1.396,
    open: 1.4283,
    weightedAvgPrice: 1.4222,
    count: 962981,
    timestamp: '2026-03-06 08:05:43',
    data: [],
  },
];

// Generate realistic chart data based on current price
export const generateChartData = (basePrice: number, points: number = 48, trend: 'up' | 'down' | 'neutral' = 'neutral') => {
  const data = [];
  let value = basePrice;
  const now = new Date();
  const trendMultiplier = trend === 'up' ? 1.001 : trend === 'down' ? 0.999 : 1;
  
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 30 * 60 * 1000);
    const randomChange = (Math.random() - 0.5) * 0.02;
    value = value * (trendMultiplier + randomChange);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.max(0, value),
    });
  }
  return data;
};

// Initialize chart data for all assets
realMarketAssets.forEach(asset => {
  const trend = asset.priceChangePercent >= 0 ? 'up' : 'down';
  asset.data = generateChartData(asset.price, 48, trend);
});

// Format currency helper
export const formatCurrency = (value: number, decimals: number = 2): string => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(decimals)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(decimals)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
};

// Format crypto amount
export const formatCrypto = (value: number, symbol: string): string => {
  if (value < 0.01) {
    return `${value.toFixed(6)} ${symbol}`;
  }
  if (value < 1) {
    return `${value.toFixed(4)} ${symbol}`;
  }
  return `${value.toFixed(2)} ${symbol}`;
};

// Get market summary
export const getMarketSummary = () => {
  const totalVolume = realMarketAssets.reduce((sum, asset) => sum + asset.quoteVolume, 0);
  const avgChange = realMarketAssets.reduce((sum, asset) => sum + asset.priceChangePercent, 0) / realMarketAssets.length;
  const gainers = realMarketAssets.filter(a => a.priceChangePercent > 0).length;
  const losers = realMarketAssets.filter(a => a.priceChangePercent < 0).length;
  
  return {
    totalVolume,
    avgChange,
    gainers,
    losers,
    totalAssets: realMarketAssets.length,
    lastUpdate: realMarketAssets[0]?.timestamp || new Date().toISOString(),
  };
};

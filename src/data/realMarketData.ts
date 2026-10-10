// Market data — prices update live in the UI via simulation based on real baselines
// Baselines approximate recent market levels (updated Oct 2026)

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

export const realMarketAssets: MarketAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 97842.5,
    priceChange: 1240.3,
    priceChangePercent: 1.28,
    volume: 28500,
    quoteVolume: 2785000000,
    high: 98520.0,
    low: 96100.0,
    open: 96602.2,
    weightedAvgPrice: 97450.0,
    count: 7200000,
    timestamp: new Date().toISOString(),
    data: [],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3621.8,
    priceChange: -28.4,
    priceChangePercent: -0.78,
    volume: 480000,
    quoteVolume: 1740000000,
    high: 3685.0,
    low: 3580.0,
    open: 3650.2,
    weightedAvgPrice: 3635.0,
    count: 6900000,
    timestamp: new Date().toISOString(),
    data: [],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 178.45,
    priceChange: 6.2,
    priceChangePercent: 3.6,
    volume: 4200000,
    quoteVolume: 748000000,
    high: 182.0,
    low: 171.5,
    open: 172.25,
    weightedAvgPrice: 176.8,
    count: 2100000,
    timestamp: new Date().toISOString(),
    data: [],
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: 612.4,
    priceChange: 8.9,
    priceChangePercent: 1.47,
    volume: 145000,
    quoteVolume: 88800000,
    high: 618.0,
    low: 598.0,
    open: 603.5,
    weightedAvgPrice: 610.2,
    count: 980000,
    timestamp: new Date().toISOString(),
    data: [],
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    price: 0.5842,
    priceChange: 0.012,
    priceChangePercent: 2.1,
    volume: 98000000,
    quoteVolume: 57200000,
    high: 0.592,
    low: 0.568,
    open: 0.572,
    weightedAvgPrice: 0.581,
    count: 1100000,
    timestamp: new Date().toISOString(),
    data: [],
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.412,
    priceChange: -0.008,
    priceChangePercent: -1.9,
    volume: 125000000,
    quoteVolume: 51500000,
    high: 0.425,
    low: 0.405,
    open: 0.42,
    weightedAvgPrice: 0.414,
    count: 320000,
    timestamp: new Date().toISOString(),
    data: [],
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    price: 4.85,
    priceChange: 0.12,
    priceChangePercent: 2.54,
    volume: 8500000,
    quoteVolume: 41200000,
    high: 4.92,
    low: 4.68,
    open: 4.73,
    weightedAvgPrice: 4.82,
    count: 185000,
    timestamp: new Date().toISOString(),
    data: [],
  },
];

export const generateChartData = (basePrice: number, points: number = 48, trend: 'up' | 'down' | 'neutral' = 'neutral') => {
  const data = [];
  let value = basePrice * 0.98;
  const now = new Date();
  const trendMultiplier = trend === 'up' ? 1.0008 : trend === 'down' ? 0.9992 : 1;
  
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 30 * 60 * 1000);
    const randomChange = (Math.random() - 0.5) * 0.012;
    value = value * (trendMultiplier + randomChange);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.max(0, value),
    });
  }
  // Ensure last point is close to current price
  data[data.length - 1].value = basePrice;
  return data;
};

realMarketAssets.forEach(asset => {
  const trend = asset.priceChangePercent >= 0 ? 'up' : 'down';
  asset.data = generateChartData(asset.price, 48, trend);
});

export const formatCurrency = (value: number, decimals: number = 2): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(decimals)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(decimals)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(decimals)}K`;
  return `$${value.toFixed(decimals)}`;
};

export const formatCrypto = (value: number, symbol: string): string => {
  if (value < 0.01) return `${value.toFixed(6)} ${symbol}`;
  if (value < 1) return `${value.toFixed(4)} ${symbol}`;
  return `${value.toFixed(2)} ${symbol}`;
};

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
    lastUpdate: new Date().toISOString(),
  };
};

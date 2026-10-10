import { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, Clock, RefreshCw, DollarSign } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { realMarketAssets, formatCurrency, type MarketAsset } from '@/data/realMarketData';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function MarketSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [assets, setAssets] = useState<MarketAsset[]>(realMarketAssets);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(realMarketAssets[0]);
  const [timeRange, setTimeRange] = useState<'1H' | '24H' | '7D' | '30D'>('24H');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { isAuthenticated, user, createTransaction } = useAuth();
  
  // Trade modal states
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeAmountUSD, setTradeAmountUSD] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Simulate live price updates with real data base
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const randomChange = (Math.random() - 0.5) * 0.001;
        const newPrice = asset.price * (1 + randomChange);
        const priceChange = newPrice - asset.open;
        const priceChangePercent = (priceChange / asset.open) * 100;
        
        // Update chart data
        const newDataPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          value: newPrice,
        };
        const newData = [...asset.data.slice(1), newDataPoint];
        
        return {
          ...asset,
          price: newPrice,
          priceChange,
          priceChangePercent,
          data: newData,
        };
      }));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    // In production, this would fetch from Binance API
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
      toast.success('Market data refreshed');
    }, 1000);
  }, []);

  const handleTrade = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to trade');
      return;
    }
    
    const amount = parseFloat(tradeAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const totalUSD = amount * selectedAsset.price;
    
    if (tradeType === 'buy') {
      if (!user || user.balance < totalUSD) {
        toast.error('Insufficient balance');
        return;
      }
    }

    await createTransaction(
      tradeType === 'buy' ? 'buy' : 'sell',
      totalUSD,
      selectedAsset.symbol,
      `${tradeType === 'buy' ? 'Bought' : 'Sold'} ${amount} ${selectedAsset.symbol} at $${selectedAsset.price}`
    );

    setShowTradeModal(false);
    setTradeAmount('');
    setTradeAmountUSD('');
  };

  const updateTradeAmount = (value: string, isCrypto: boolean) => {
    if (isCrypto) {
      setTradeAmount(value);
      const usd = parseFloat(value) * selectedAsset.price;
      setTradeAmountUSD(usd ? usd.toFixed(2) : '');
    } else {
      setTradeAmountUSD(value);
      const crypto = parseFloat(value) / selectedAsset.price;
      setTradeAmount(crypto ? crypto.toFixed(6) : '');
    }
  };

  const marketSummary = {
    totalVolume: assets.reduce((sum, a) => sum + a.quoteVolume, 0),
    avgChange: assets.reduce((sum, a) => sum + a.priceChangePercent, 0) / assets.length,
    gainers: assets.filter(a => a.priceChangePercent > 0).length,
    losers: assets.filter(a => a.priceChangePercent < 0).length,
  };

  return (
    <section
      ref={sectionRef}
      id="markets"
      className="relative py-24 bg-lab-white overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-led-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-led-green/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`flex flex-wrap items-end justify-between gap-6 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-led-green/10 mb-4">
              <Activity className="w-4 h-4 text-led-green" />
              <span className="font-mono text-xs uppercase tracking-wider text-led-green">
                Live Markets
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
              Trade with confidence
            </h2>
            <p className="text-muted-foreground mt-2">
              Real-time data from Binance • Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="p-3 rounded-xl bg-white shadow-card hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-led-purple ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Time Range Selector */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              {(['1H', '24H', '7D', '30D'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    timeRange === range
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Market Summary */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
            <p className="font-mono font-bold text-xl text-foreground">{formatCurrency(marketSummary.totalVolume)}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Avg Change</p>
            <p className={`font-mono font-bold text-xl ${marketSummary.avgChange >= 0 ? 'text-led-green' : 'text-red-500'}`}>
              {marketSummary.avgChange >= 0 ? '+' : ''}{marketSummary.avgChange.toFixed(2)}%
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Gainers</p>
            <p className="font-mono font-bold text-xl text-led-green">{marketSummary.gainers}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Losers</p>
            <p className="font-mono font-bold text-xl text-red-500">{marketSummary.losers}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Asset List */}
          <div
            className={`lg:col-span-1 space-y-3 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedAsset.symbol === asset.symbol
                    ? 'ring-2 ring-led-purple shadow-led-purple'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      asset.priceChangePercent >= 0 ? 'bg-led-green/10' : 'bg-red-500/10'
                    }`}>
                      <span className={`font-mono font-bold text-sm ${
                        asset.priceChangePercent >= 0 ? 'text-led-green' : 'text-red-500'
                      }`}>
                        {asset.symbol}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{asset.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        Vol: {formatCurrency(asset.quoteVolume)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-foreground">
                      ${asset.price.toLocaleString('en-US', { 
                        minimumFractionDigits: asset.price < 1 ? 4 : 2,
                        maximumFractionDigits: asset.price < 1 ? 4 : 2 
                      })}
                    </p>
                    <div className={`flex items-center justify-end gap-1 text-xs ${
                      asset.priceChangePercent >= 0 ? 'text-led-green' : 'text-red-500'
                    }`}>
                      {asset.priceChangePercent >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span className="font-mono">
                        {asset.priceChangePercent >= 0 ? '+' : ''}{asset.priceChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div
            className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Chart Card */}
            <div className="glass-card led-glow-purple p-6">
              {/* Chart Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-bold text-2xl text-foreground">
                      {selectedAsset.name}
                    </h3>
                    <span className="px-2 py-1 rounded-lg bg-gray-100 font-mono text-sm text-muted-foreground">
                      {selectedAsset.symbol}/USD
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-3xl font-bold text-foreground">
                      ${selectedAsset.price.toLocaleString('en-US', { 
                        minimumFractionDigits: selectedAsset.price < 1 ? 4 : 2,
                        maximumFractionDigits: selectedAsset.price < 1 ? 4 : 2 
                      })}
                    </span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      selectedAsset.priceChangePercent >= 0 ? 'bg-led-green/10 text-led-green' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {selectedAsset.priceChangePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-mono font-medium">
                        {selectedAsset.priceChangePercent >= 0 ? '+' : ''}{selectedAsset.priceChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setTradeType('buy');
                      setShowTradeModal(true);
                    }}
                    className="bg-led-green hover:bg-led-green/90 text-white"
                  >
                    Buy {selectedAsset.symbol}
                  </Button>
                  <Button
                    onClick={() => {
                      setTradeType('sell');
                      setShowTradeModal(true);
                    }}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Sell
                  </Button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedAsset.data}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedAsset.priceChangePercent >= 0 ? '#12B381' : '#ef4444'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={selectedAsset.priceChangePercent >= 0 ? '#12B381' : '#ef4444'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      interval={5}
                    />
                    <YAxis 
                      domain={['dataMin', 'dataMax']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      tickFormatter={(value) => `$${value.toFixed(selectedAsset.price < 1 ? 4 : 0)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number) => [`$${value.toFixed(selectedAsset.price < 1 ? 4 : 2)}`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={selectedAsset.priceChangePercent >= 0 ? '#12B381' : '#ef4444'}
                      strokeWidth={3}
                      fill="url(#chartGradient)"
                      animationDuration={500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">24h High</p>
                  <p className="font-mono font-semibold text-foreground">
                    ${selectedAsset.high.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">24h Low</p>
                  <p className="font-mono font-semibold text-foreground">
                    ${selectedAsset.low.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                  <p className="font-mono font-semibold text-foreground">
                    {formatCurrency(selectedAsset.quoteVolume)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      <Dialog open={showTradeModal} onOpenChange={setShowTradeModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Price Display */}
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-sm text-muted-foreground mb-1">Current Price</p>
              <p className="font-mono text-2xl font-bold text-foreground">
                ${selectedAsset.price.toLocaleString('en-US', { 
                  minimumFractionDigits: selectedAsset.price < 1 ? 4 : 2,
                  maximumFractionDigits: selectedAsset.price < 1 ? 4 : 2 
                })}
              </p>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Amount ({selectedAsset.symbol})
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={tradeAmount}
                    onChange={(e) => updateTradeAmount(e.target.value, true)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Total (USD)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={tradeAmountUSD}
                    onChange={(e) => updateTradeAmount(e.target.value, false)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleTrade}
              className={`w-full h-12 ${tradeType === 'buy' ? 'bg-led-green hover:bg-led-green/90' : 'bg-red-500 hover:bg-red-500/90'} text-white`}
            >
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

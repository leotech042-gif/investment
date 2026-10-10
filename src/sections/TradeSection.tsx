import { useState, useEffect, useRef } from 'react';
import { Lock, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function TradeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTrade = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to trade');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success(`${tradeType === 'buy' ? 'Buy' : 'Sell'} order placed for ${amount} BTC`);
    setAmount('');
  };

  return (
    <section
      ref={sectionRef}
      id="trade"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/feature_bg_farm_05.jpg)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(246,247,250,0.9) 0%, rgba(246,247,250,0.5) 50%, rgba(246,247,250,0.9) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Block */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-wider text-led-purple mb-4 block">
              TRADE
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              Buy & sell with confidence.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Clear pricing, fast execution, and built-in safeguards so you always know what you're getting.
            </p>

            {/* Security Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-led-green/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-led-green" />
              </div>
              <div>
                <p className="font-medium text-foreground">Encrypted</p>
                <p className="text-sm text-muted-foreground">Bank-level security</p>
              </div>
            </div>
          </div>

          {/* Trade Card */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="glass-card led-glow-purple p-6">
              {/* Asset Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center">
                    <span className="font-mono font-bold text-white">₿</span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-xl text-foreground">Bitcoin</p>
                    <p className="font-mono text-sm text-muted-foreground">BTC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-2xl text-foreground">$45,234.56</p>
                  <div className="flex items-center justify-end gap-1 text-led-green">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-mono text-sm">+2.34%</span>
                  </div>
                </div>
              </div>

              {/* Trade Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                    tradeType === 'buy'
                      ? 'bg-led-green text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                    tradeType === 'sell'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Amount (BTC)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-14 text-lg font-mono rounded-xl pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      BTC
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Total (USD)</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      readOnly
                      value={amount ? `$${(parseFloat(amount) * 45234.56).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                      className="h-14 text-lg font-mono rounded-xl bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 mb-6">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Fees: 0.5% | Settlement: Instant | Min: $10
                </p>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleTrade}
                className={`w-full h-14 text-lg font-medium rounded-xl transition-all duration-300 ${
                  tradeType === 'buy'
                    ? 'bg-led-green hover:bg-led-green/90 text-white'
                    : 'bg-red-500 hover:bg-red-500/90 text-white'
                }`}
              >
                {tradeType === 'buy' ? 'Buy Bitcoin' : 'Sell Bitcoin'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

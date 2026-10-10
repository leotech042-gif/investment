import { useState, useEffect, useRef } from 'react';
import { Sprout, TrendingUp, Shield, Clock, Percent, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const earningsData = [
  { month: 'Jan', earnings: 120 },
  { month: 'Feb', earnings: 145 },
  { month: 'Mar', earnings: 138 },
  { month: 'Apr', earnings: 168 },
  { month: 'May', earnings: 195 },
  { month: 'Jun', earnings: 234 },
  { month: 'Jul', earnings: 278 },
  { month: 'Aug', earnings: 312 },
  { month: 'Sep', earnings: 356 },
  { month: 'Oct', earnings: 398 },
  { month: 'Nov', earnings: 445 },
  { month: 'Dec', earnings: 512 },
];

const earningOptions = [
  {
    name: 'Flexible Savings',
    apy: 4.5,
    minDeposit: 0,
    lockPeriod: 'None',
    risk: 'Low',
    icon: Wallet,
    color: 'bg-led-green',
  },
  {
    name: 'Fixed Term',
    apy: 8.5,
    minDeposit: 1000,
    lockPeriod: '30 days',
    risk: 'Low',
    icon: Clock,
    color: 'bg-led-purple',
  },
  {
    name: 'Staking',
    apy: 12.0,
    minDeposit: 100,
    lockPeriod: '7 days',
    risk: 'Medium',
    icon: Sprout,
    color: 'bg-blue-500',
  },
];

export function EarnSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(earningOptions[0]);
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

  const handleStartEarning = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to start earning');
      return;
    }
    toast.success(`Started ${selectedOption.name} with ${selectedOption.apy}% APY!`);
  };

  return (
    <section
      ref={sectionRef}
      id="earn"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/feature_bg_farm_07.jpg)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(246,247,250,0.9) 0%, rgba(246,247,250,0.5) 50%, rgba(246,247,250,0.9) 100%)',
          }}
        />
      </div>

      {/* LED Bars */}
      <div className="absolute right-[2vw] top-[20vh] w-2 h-[45vh] rounded-full bg-gradient-to-b from-led-green/40 to-led-blue/20" />
      <div className="absolute right-[3.5vw] top-[25vh] w-1.5 h-[30vh] rounded-full bg-gradient-to-b from-led-blue/35 to-led-green/15" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Block */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-wider text-led-purple mb-4 block">
              EARN
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              Earn & grow over time.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Put your assets to work with transparent yields, simple terms, and no hidden lockups.
            </p>

            {/* Earning Options */}
            <div className="space-y-3">
              {earningOptions.map((option) => (
                <div
                  key={option.name}
                  onClick={() => setSelectedOption(option)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedOption.name === option.name
                      ? 'bg-white shadow-card ring-2 ring-led-purple'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${option.color} flex items-center justify-center`}>
                        <option.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{option.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Min: ${option.minDeposit} • {option.lockPeriod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-lg text-led-green">{option.apy}%</p>
                      <p className="text-xs text-muted-foreground">APY</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Card */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="glass-card led-glow-green p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Projected Earnings</p>
                  <p className="font-display font-bold text-3xl text-foreground">$512.00</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-led-green/10 text-led-green text-sm">
                      <TrendingUp className="w-3 h-3" />
                      +18.5%
                    </div>
                    <span className="text-sm text-muted-foreground">this year</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-led-green/10 flex items-center justify-center">
                  <Percent className="w-6 h-6 text-led-green" />
                </div>
              </div>

              {/* Chart */}
              <div className="h-[250px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="earnGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#12B381" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#12B381" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number) => [`$${value}`, 'Earnings']}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#12B381"
                      strokeWidth={3}
                      fill="url(#earnGradient)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Selected Option Details */}
              <div className="p-4 rounded-2xl bg-led-green/5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Selected</span>
                  <span className="font-medium text-foreground">{selectedOption.name}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">APY</span>
                  <span className="font-mono font-bold text-led-green">{selectedOption.apy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-led-green" />
                    <span className="text-sm">{selectedOption.risk}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button onClick={handleStartEarning} className="w-full btn-primary h-12">
                Start Earning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

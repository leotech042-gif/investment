import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, Bitcoin, Gift, TrendingUp, ArrowRight } from 'lucide-react';

const assetData = [
  { name: 'Cash', value: 40, color: '#12B381', icon: Wallet },
  { name: 'Crypto', value: 32, color: '#7B2D8E', icon: Bitcoin },
  { name: 'Gift Cards', value: 12, color: '#2C74F0', icon: Gift },
  { name: 'Investments', value: 16, color: '#f59e0b', icon: TrendingUp },
];

export function AssetsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  return (
    <section
      ref={sectionRef}
      id="assets"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/feature_bg_farm_09.jpg)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(246,247,250,0.9) 0%, rgba(246,247,250,0.5) 50%, rgba(246,247,250,0.9) 100%)',
          }}
        />
      </div>

      {/* LED Disc */}
      <div className="absolute -right-32 top-1/3 w-96 h-96 rounded-full bg-led-blue/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Block */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-wider text-led-purple mb-4 block">
              DIVERSIFY
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              All assets. One view.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              From cash to crypto to collectibles—track performance, allocation, and risk in one place.
            </p>

            <button className="inline-flex items-center gap-2 text-led-purple font-medium hover:gap-3 transition-all duration-300 group">
              View allocation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Chart Card */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="glass-card led-glow-blue p-6">
              <h3 className="font-display font-semibold text-xl text-foreground mb-6">
                Your Assets
              </h3>

              {/* Pie Chart */}
              <div className="h-[250px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {assetData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="white"
                          strokeWidth={3}
                          style={{
                            filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                            transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                            transformOrigin: 'center',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                {assetData.map((asset) => (
                  <div
                    key={asset.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <asset.icon 
                      className="w-4 h-4"
                      style={{ color: asset.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{asset.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{asset.value}%</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Portfolio</span>
                  <span className="font-mono font-bold text-xl text-foreground">$25,000.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

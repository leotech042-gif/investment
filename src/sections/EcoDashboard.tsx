import { useEffect, useState, useRef } from 'react';
import { Droplets, Leaf, Wind, Zap, TrendingUp, Sprout } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  trend: number;
  color: string;
  delay: number;
}

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
}

function MetricCard({ icon: Icon, label, value, unit, trend, color, delay }: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`eco-metric-card group transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: trend >= 0 ? 'rgba(18, 179, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: trend >= 0 ? '#12B381' : '#ef4444'
            }}
          >
            <TrendingUp className="w-3 h-3" />
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="counter-roll text-3xl font-display font-bold text-foreground">
            <AnimatedCounter value={value} />
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  );
}

// Generate chart data
const generateHourlyData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours() + ':00',
      water: 150 + Math.random() * 50,
      carbon: 80 + Math.random() * 30,
      harvest: 20 + Math.random() * 15,
    });
  }
  return data;
};

const hourlyData = generateHourlyData();

export function EcoDashboard() {
  const [activeTab, setActiveTab] = useState<'water' | 'carbon' | 'harvest'>('water');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const metrics = [
    { icon: Droplets, label: 'Water Saved', value: 2458900, unit: 'L', trend: 12.5, color: '#2C74F0' },
    { icon: Wind, label: 'Carbon Offset', value: 45600, unit: 'kg', trend: 8.3, color: '#12B381' },
    { icon: Sprout, label: 'Daily Harvest', value: 1847, unit: 'kg', trend: 15.2, color: '#7B2D8E' },
    { icon: Zap, label: 'Energy Efficiency', value: 94, unit: '%', trend: 5.7, color: '#f59e0b' },
  ];

  const tabConfig = {
    water: { color: '#2C74F0', label: 'Water Usage' },
    carbon: { color: '#12B381', label: 'Carbon Offset' },
    harvest: { color: '#7B2D8E', label: 'Harvest Yield' },
  };

  return (
    <section 
      ref={sectionRef}
      id="eco-dashboard"
      className="relative py-24 bg-lab-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-led-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-led-green/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-led-purple/10 mb-6">
            <Leaf className="w-4 h-4 text-led-purple" />
            <span className="font-mono text-xs uppercase tracking-wider text-led-purple">
              Eco-Dashboard
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Growing sustainably
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time metrics showing our impact on the environment. Every investment helps us grow cleaner and greener.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              {...metric}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Chart Section */}
        <div 
          className={`glass-card p-6 lg:p-8 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Chart Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-1">
                Performance Analytics
              </h3>
              <p className="text-sm text-muted-foreground">
                24-hour trend analysis
              </p>
            </div>
            
            {/* Tab Buttons */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              {(Object.keys(tabConfig) as Array<keyof typeof tabConfig>).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tabConfig[tab].label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id={`gradient-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={tabConfig[activeTab].color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={tabConfig[activeTab].color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  interval={3}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Area
                  type="monotone"
                  dataKey={activeTab}
                  stroke={tabConfig[activeTab].color}
                  strokeWidth={3}
                  fill={`url(#gradient-${activeTab})`}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2C74F0]" />
              <span className="text-sm text-muted-foreground">Water (L/hr)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#12B381]" />
              <span className="text-sm text-muted-foreground">Carbon (kg/hr)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#7B2D8E]" />
              <span className="text-sm text-muted-foreground">Harvest (kg/hr)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

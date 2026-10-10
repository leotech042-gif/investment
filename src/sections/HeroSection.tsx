import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Activity, Sparkles } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface HeroSectionProps {
  onOpenLogin: (mode: "login" | "register") => void;
}

const generateChartData = (points: number, trend: "up" | "down") => {
  const data = [];
  let value = trend === "up" ? 45000 : 3000;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.4) * (trend === "up" ? 500 : 50);
    data.push({ value });
  }
  return data;
};

const marketAssets = [
  { symbol: "BTC", name: "Bitcoin", price: 97842.5, change: 2.34, trend: "up" as const },
  { symbol: "ETH", name: "Ethereum", price: 3621.8, change: -0.87, trend: "down" as const },
  { symbol: "SOL", name: "Solana", price: 178.45, change: 5.12, trend: "up" as const },
];

export function HeroSection({ onOpenLogin }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible] = useState(true);
  const [livePrices, setLivePrices] = useState(marketAssets);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices((prev) =>
        prev.map((asset) => ({
          ...asset,
          price: asset.price * (1 + (Math.random() - 0.5) * 0.0015),
          change: asset.change + (Math.random() - 0.5) * 0.08,
        })),
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-50/40 dark:to-purple-950/20" />
        {/* Soft orbs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-purple-400/10 dark:bg-purple-500/8 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-400/5 dark:bg-blue-500/5 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(120,50,150,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(120,50,150,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[72px]">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-72px)] py-16">
          {/* Left content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="section-label mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Modular investing platform
            </div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.25rem] text-foreground leading-[0.95] mb-6">
              Invest{" "}
              <span className="text-gradient">glowing</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-md leading-relaxed">
              One modular account for crypto, cash, gift cards and ideas — built with precision and clarity.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button
                onClick={() => onOpenLogin("register")}
                className="btn-primary group h-13 px-8 text-base"
              >
                Open account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("markets")?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-secondary h-13 px-8 text-base"
              >
                See markets
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-led-green animate-pulse" />
                Live markets
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-led-purple" />
                Bank-level security
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-led-blue" />
                Instant transfers
              </div>
            </div>
          </div>

          {/* Right — Live market card */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="glass-card led-glow-purple p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-led-green animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Live Market
                  </span>
                </div>
                <Activity className="w-5 h-5 text-led-purple" />
              </div>

              <div className="space-y-3">
                {livePrices.map((asset, index) => (
                  <div
                    key={asset.symbol}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] hover:bg-white/90 dark:hover:bg-white/[0.07] transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-200/50 dark:hover:border-purple-500/20"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          asset.trend === "up"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        <span className="font-mono font-bold text-sm">{asset.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{asset.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{asset.symbol}/USD</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-semibold text-foreground">
                        $
                        {asset.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <div
                        className={`flex items-center justify-end gap-1 text-sm ${
                          asset.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                        }`}
                      >
                        {asset.change >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span className="font-mono">
                          {asset.change >= 0 ? "+" : ""}
                          {asset.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:block w-20 h-9 ml-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateChartData(16, asset.trend)}>
                          <YAxis domain={["dataMin", "dataMax"]} hide />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={asset.trend === "up" ? "#10b981" : "#ef4444"}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last updated</span>
                <span className="font-mono text-led-purple dark:text-purple-400">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

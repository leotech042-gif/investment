import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface HeroSectionProps {
  onOpenLogin: (mode: "login" | "register") => void;
}

// Mock live market data
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
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 45234.56,
    change: 2.34,
    trend: "up" as const,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2891.23,
    change: -1.23,
    trend: "down" as const,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 98.45,
    change: 5.67,
    trend: "up" as const,
  },
];

export function HeroSection({ onOpenLogin }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible] = useState(true);
  const [livePrices, setLivePrices] = useState(marketAssets);

  useEffect(() => {
    // setIsVisible(true);

    // Simulate live price updates
    const interval = setInterval(() => {
      setLivePrices((prev) =>
        prev.map((asset) => ({
          ...asset,
          price: asset.price * (1 + (Math.random() - 0.5) * 0.002),
          change: asset.change + (Math.random() - 0.5) * 0.1,
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/hero_bg_farm.jpg)" }}
      >
        {/* White scrim overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(246,247,250,0.82) 0%, rgba(246,247,250,0.35) 60%, rgba(246,247,250,0.72) 100%)",
          }}
        />
      </div>

      {/* LED Decorative Bars */}
      <div
        className={`absolute right-[2.2vw] top-[15vh] w-2 h-[50vh] rounded-full transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(123, 45, 142, 0.4) 0%, rgba(18, 179, 129, 0.2) 100%)",
          transformOrigin: "bottom",
          transitionDelay: "0.6s",
        }}
      />
      <div
        className={`absolute right-[3.5vw] top-[20vh] w-1.5 h-[35vh] rounded-full transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(18, 179, 129, 0.35) 0%, rgba(44, 116, 240, 0.2) 100%)",
          transformOrigin: "bottom",
          transitionDelay: "0.7s",
        }}
      />
      <div
        className={`absolute right-[1.2vw] top-[25vh] w-1 h-[40vh] rounded-full transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(44, 116, 240, 0.3) 0%, rgba(123, 45, 142, 0.15) 100%)",
          transformOrigin: "bottom",
          transitionDelay: "0.8s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[72px]">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-72px)] py-12">
          {/* Hero Card */}
          <div
            className={`glass-card p-8 lg:p-10 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-[0.98]"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.95] mb-6">
              Invest <span className="text-gradient">glowing</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              A modular account for crypto, cash, gift cards, and ideas—built
              like a precision system.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => onOpenLogin("register")}
                className="btn-primary group"
              >
                Open account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("markets")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-secondary"
              >
                See markets
              </Button>
            </div>
          </div>

          {/* Live Market Card */}
          <div
            className={`glass-card led-glow-purple p-6 lg:p-8 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-[10vw]"
            }`}
            style={{ transitionDelay: "0.4s" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-led-green animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Live Market
                </span>
              </div>
              <Activity className="w-5 h-5 text-led-purple" />
            </div>

            {/* Asset List */}
            <div className="space-y-4">
              {livePrices.map((asset, index) => (
                <div
                  key={asset.symbol}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-all duration-300 cursor-pointer holographic-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        asset.trend === "up"
                          ? "bg-led-green/10"
                          : "bg-red-500/10"
                      }`}
                    >
                      <span
                        className={`font-mono font-bold text-sm ${
                          asset.trend === "up"
                            ? "text-led-green"
                            : "text-red-500"
                        }`}
                      >
                        {asset.symbol}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {asset.name}
                      </p>
                      <p className="font-mono text-sm text-muted-foreground">
                        {asset.symbol}/USD
                      </p>
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
                        asset.change >= 0 ? "text-led-green" : "text-red-500"
                      }`}
                    >
                      {asset.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="font-mono">
                        {asset.change >= 0 ? "+" : ""}
                        {asset.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="hidden sm:block w-24 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateChartData(20, asset.trend)}>
                        <YAxis domain={["dataMin", "dataMax"]} hide />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={asset.trend === "up" ? "#12B381" : "#ef4444"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last updated</span>
                <span className="font-mono text-led-purple">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

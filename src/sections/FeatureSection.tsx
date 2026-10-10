import { useEffect, useRef, useState } from 'react';
import { Wallet, Bitcoin, CreditCard, Lightbulb, ArrowRight } from 'lucide-react';

interface FeatureSectionProps {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  cardHeader?: string;
  cardMicrocopy?: string;
  chips?: string[];
  pillText?: string;
  bgImage: string;
  glowColor: 'purple' | 'green' | 'blue';
  reversed?: boolean;
}

const chipIcons: Record<string, React.ElementType> = {
  Cash: Wallet,
  Crypto: Bitcoin,
  Cards: CreditCard,
  Ideas: Lightbulb,
};

export function FeatureSection({
  id,
  eyebrow,
  headline,
  body,
  cardHeader,
  cardMicrocopy,
  chips,
  pillText,
  bgImage,
  glowColor,
  reversed = false,
}: FeatureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const glowClass = {
    purple: 'shadow-led-purple',
    green: 'shadow-led-green',
    blue: 'shadow-led-blue',
  }[glowColor];

  const glowBg = {
    purple: 'bg-led-purple/10',
    green: 'bg-led-green/10',
    blue: 'bg-led-blue/10',
  }[glowColor];

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(246,247,250,0.88) 0%, rgba(246,247,250,0.45) 50%, rgba(246,247,250,0.85) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Block */}
          <div
            className={`${reversed ? 'lg:order-2' : ''} transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${reversed ? 'translate-x-20' : '-translate-x-20'}`
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-wider text-led-purple mb-4 block">
              {eyebrow}
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              {headline}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              {body}
            </p>
            <button className="inline-flex items-center gap-2 text-led-purple font-medium hover:gap-3 transition-all duration-300 group">
              Learn more
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature Card */}
          <div
            className={`${reversed ? 'lg:order-1' : ''} transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${reversed ? '-translate-x-20' : 'translate-x-20'}`
            }`}
          >
            <div className={`glass-card ${glowClass} p-8 ambient-glow`}>
              {cardHeader && (
                <div className="mb-6">
                  <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                    {cardHeader}
                  </h3>
                  {cardMicrocopy && (
                    <p className="text-sm text-muted-foreground">{cardMicrocopy}</p>
                  )}
                </div>
              )}

              {pillText && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-led-green/10 text-led-green font-mono text-sm mb-6">
                  <div className="w-2 h-2 rounded-full bg-led-green animate-pulse" />
                  {pillText}
                </div>
              )}

              {chips && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {chips.map((chip, index) => {
                    const Icon = chipIcons[chip] || Lightbulb;
                    return (
                      <div
                        key={chip}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl ${glowBg} hover:scale-105 transition-transform duration-300 cursor-pointer`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <Icon className="w-6 h-6 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{chip}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Decorative element */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-mono text-led-green">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

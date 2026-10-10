import { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Eye, FileCheck, CheckCircle2 } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-end encryption',
    description: 'Your data is encrypted at rest and in transit with AES-256',
  },
  {
    icon: Eye,
    title: 'Real-time monitoring',
    description: '24/7 fraud detection and suspicious activity alerts',
  },
  {
    icon: FileCheck,
    title: 'Transparent policies',
    description: 'Clear terms, no hidden fees, full audit trails',
  },
];

export function SecuritySection() {
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

  return (
    <section
      ref={sectionRef}
      id="security"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/security_bg_farm.jpg)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(246,247,250,0.92) 0%, rgba(246,247,250,0.6) 50%, rgba(246,247,250,0.92) 100%)',
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
              SECURITY
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              Your assets are protected.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Encryption, monitoring, and transparent policies—so you can focus on growing, not worrying.
            </p>

            {/* Protection Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-led-green/10">
              <Shield className="w-4 h-4 text-led-green" />
              <span className="text-sm font-medium text-led-green">Protection</span>
            </div>
          </div>

          {/* Security Card */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="glass-card led-glow-purple p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-led-purple/10 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-led-purple" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl text-foreground">Security Center</h3>
                  <p className="text-sm text-muted-foreground">All systems operational</p>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-led-green/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-5 h-5 text-led-green" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{feature.title}</h4>
                        <CheckCircle2 className="w-4 h-4 text-led-green" />
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="font-mono font-bold text-xl text-led-purple">99.9%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="font-mono font-bold text-xl text-led-green">$0</p>
                  <p className="text-xs text-muted-foreground">Lost to hacks</p>
                </div>
                <div className="text-center">
                  <p className="font-mono font-bold text-xl text-blue-500">256-bit</p>
                  <p className="text-xs text-muted-foreground">Encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

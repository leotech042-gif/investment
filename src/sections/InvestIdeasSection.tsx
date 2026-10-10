import { useState, useEffect, useRef } from 'react';
import { Lightbulb, TrendingUp, Shield, Globe, Cpu, Leaf, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { toast } from 'sonner';

interface InvestmentIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  expectedReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

const investmentIdeas: InvestmentIdea[] = [
  {
    id: '1',
    title: 'Green Energy Index',
    description: 'Diversified portfolio of renewable energy companies',
    category: 'ESG',
    expectedReturn: 12.5,
    riskLevel: 'Medium',
    trend: 'up',
    icon: Leaf,
    color: 'bg-led-green',
  },
  {
    id: '2',
    title: 'Tech Innovation Fund',
    description: 'AI and blockchain technology leaders',
    category: 'Technology',
    expectedReturn: 18.2,
    riskLevel: 'High',
    trend: 'up',
    icon: Cpu,
    color: 'bg-blue-500',
  },
  {
    id: '3',
    title: 'Global Dividend',
    description: 'Stable income from international markets',
    category: 'Income',
    expectedReturn: 6.8,
    riskLevel: 'Low',
    trend: 'up',
    icon: Globe,
    color: 'bg-led-purple',
  },
];

export function InvestIdeasSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<InvestmentIdea | null>(null);
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

  const handleInvest = (idea: InvestmentIdea) => {
    if (!isAuthenticated) {
      toast.error('Please log in to invest');
      return;
    }
    toast.success(`Investment initiated: ${idea.title}`);
  };

  return (
    <section
      ref={sectionRef}
      id="ideas"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/feature_bg_farm_08.jpg)' }}
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
              OPPORTUNITIES
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              Investing ideas, curated.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Explore themes and strategies with clear risk labels, then act with one tap.
            </p>

            {/* Themes Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-led-purple/10">
              <Lightbulb className="w-4 h-4 text-led-purple" />
              <span className="text-sm font-medium text-led-purple">Themes</span>
            </div>
          </div>

          {/* Ideas List */}
          <div
            className={`space-y-4 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            {investmentIdeas.map((idea, index) => (
              <div
                key={idea.id}
                className="glass-card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedIdea(idea)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${idea.color} flex items-center justify-center flex-shrink-0`}>
                      <idea.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-lg text-foreground">{idea.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          idea.riskLevel === 'Low' ? 'bg-led-green/10 text-led-green' :
                          idea.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {idea.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{idea.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">{idea.category}</span>
                        <div className={`flex items-center gap-1 ${idea.trend === 'up' ? 'text-led-green' : 'text-red-500'}`}>
                          <TrendingUp className="w-3 h-3" />
                          <span className="font-mono text-sm">+{idea.expectedReturn}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInvest(idea);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity btn-primary"
                  >
                    Invest
                  </Button>
                </div>
              </div>
            ))}

            {/* View All */}
            <button className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-led-purple hover:bg-led-purple/5 transition-all duration-300 flex items-center justify-center gap-2 group">
              <span className="text-muted-foreground group-hover:text-led-purple font-medium transition-colors">
                View all opportunities
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-led-purple transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedIdea(null)}
        >
          <div 
            className="glass-card max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl ${selectedIdea.color} flex items-center justify-center`}>
                <selectedIdea.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">{selectedIdea.title}</h3>
                <span className="text-sm text-muted-foreground">{selectedIdea.category}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-2xl bg-gray-50">
                <p className="text-sm text-muted-foreground mb-1">Expected Return</p>
                <p className="font-mono text-2xl font-bold text-led-green">+{selectedIdea.expectedReturn}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50">
                <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-led-purple" />
                  <span className="font-medium">{selectedIdea.riskLevel}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-led-purple/5">
                <Info className="w-4 h-4 text-led-purple mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{selectedIdea.description}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  handleInvest(selectedIdea);
                  setSelectedIdea(null);
                }}
                className="flex-1 btn-primary"
              >
                Invest Now
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedIdea(null)}
                className="btn-secondary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

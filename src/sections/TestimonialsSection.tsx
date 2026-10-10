import { useState, useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    handle: '@sarahchen',
    avatar: 'SC',
    quote: 'Invest Glowing transformed how I manage my portfolio. The clean interface and real-time data make investing feel effortless.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    handle: '@mjohnson',
    avatar: 'MJ',
    quote: 'Finally, a platform that treats crypto and traditional assets equally. The gift card feature is a game changer.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    handle: '@emrodriguez',
    avatar: 'ER',
    quote: 'The eco-dashboard alone is worth it. Seeing my investments grow while knowing they\'re sustainable? Priceless.',
    rating: 5,
  },
  {
    id: '4',
    name: 'David Park',
    handle: '@dpark',
    avatar: 'DP',
    quote: 'Security was my biggest concern. Invest Glowing\'s transparent approach and encryption standards won me over.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    handle: '@lisat',
    avatar: 'LT',
    quote: 'I\'ve tried dozens of investment apps. This is the first one that feels like it was actually designed for humans.',
    rating: 5,
  },
  {
    id: '6',
    name: 'James Wilson',
    handle: '@jwilson',
    avatar: 'JW',
    quote: 'The earning options are fantastic. My idle cash is now generating real returns without any lock-in periods.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-lab-white overflow-hidden"
    >
      {/* Background */}
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
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Loved by thousands.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Builders, freelancers, and teams use Invest glowing to move faster and stay organized.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`glass-card p-6 hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-led-purple/20 mb-4" />

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-led-purple to-led-green flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

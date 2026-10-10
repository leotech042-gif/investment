import { Sprout, Twitter, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTAFooterProps {
  onOpenLogin: () => void;
}

const footerLinks = {
  Product: ['Markets', 'Wallet', 'Earn', 'Gift Cards', 'Security'],
  Company: ['About', 'Careers', 'Press', 'Blog'],
  Resources: ['Help Center', 'API Docs', 'Status', 'Community'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Licenses'],
};

export function CTAFooter({ onOpenLogin }: CTAFooterProps) {
  return (
    <footer className="relative bg-lab-dark overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(123, 45, 142, 0.18), transparent 60%)',
        }}
      />

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass-card-dark max-w-3xl mx-auto p-8 lg:p-12 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Start growing today.
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
            Open your modular account in minutes. No hidden fees. No confusing menus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={onOpenLogin}
              className="bg-white text-lab-dark hover:bg-gray-100 px-8 py-3 h-auto rounded-xl font-medium group"
            >
              Open account
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 h-auto rounded-xl font-medium"
            >
              Contact sales
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-led-purple to-led-green flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-semibold text-lg text-white">
                  Invest glowing
                </span>
              </a>
              <p className="text-sm text-gray-400 mb-6">
                A modular account for crypto, cash, gift cards, and ideas.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Github className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Mail className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-medium text-white mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Invest glowing. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Credit */}
      <div className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 text-center">
            By Lëø Têçh 🚀 | leotech042@gmail.com | 0703397260
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Gift, Plus, QrCode, Send, ShoppingBag, Coffee, Music, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GiftCard {
  id: string;
  brand: string;
  value: number;
  balance: number;
  color: string;
  icon: React.ElementType;
}

const mockGiftCards: GiftCard[] = [
  { id: '1', brand: 'Amazon', value: 100, balance: 75, color: 'bg-gradient-to-br from-orange-400 to-orange-600', icon: ShoppingBag },
  { id: '2', brand: 'Starbucks', value: 50, balance: 32, color: 'bg-gradient-to-br from-green-600 to-green-800', icon: Coffee },
  { id: '3', brand: 'Spotify', value: 60, balance: 60, color: 'bg-gradient-to-br from-green-400 to-green-600', icon: Music },
  { id: '4', brand: 'Airbnb', value: 200, balance: 150, color: 'bg-gradient-to-br from-rose-400 to-rose-600', icon: Plane },
];

export function GiftCardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
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

  const handleRedeem = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to redeem gift cards');
      return;
    }
    if (!redeemCode.trim()) {
      toast.error('Please enter a valid code');
      return;
    }
    toast.success('Gift card redeemed successfully!');
    setRedeemCode('');
    setShowRedeemModal(false);
  };

  const handleSend = (card: GiftCard) => {
    if (!isAuthenticated) {
      toast.error('Please log in to send gift cards');
      return;
    }
    toast.success(`${card.brand} gift card ready to send!`);
  };

  return (
    <section
      ref={sectionRef}
      id="giftcards"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/feature_bg_farm_06.jpg)' }}
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
              GIFT CARDS
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              Store, send, and redeem gift cards.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Keep balances in one place. Send a gift card instantly, or redeem one into your wallet.
            </p>

            {/* Redeem Button */}
            <Button
              onClick={() => setShowRedeemModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Redeem Gift Card
            </Button>
          </div>

          {/* Gift Cards Grid */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {mockGiftCards.map((card, index) => (
                <div
                  key={card.id}
                  className="group relative overflow-hidden rounded-3xl p-5 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Background */}
                  <div className={`absolute inset-0 ${card.color}`} />
                  
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <card.icon className="w-8 h-8" />
                      <span className="font-mono text-sm opacity-80">Gift Card</span>
                    </div>

                    <p className="font-display font-bold text-2xl mb-1">{card.brand}</p>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="font-mono text-3xl font-bold">${card.balance}</span>
                      <span className="text-sm opacity-70">/ ${card.value}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${(card.balance / card.value) * 100}%` }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSend(card)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                      <button className="flex items-center justify-center w-10 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Card */}
            <button
              onClick={() => setShowRedeemModal(true)}
              className="w-full mt-4 p-6 rounded-3xl border-2 border-dashed border-gray-300 hover:border-led-purple hover:bg-led-purple/5 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-led-purple/10 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-led-purple" />
              </div>
              <span className="text-muted-foreground group-hover:text-led-purple font-medium transition-colors">
                Add New Gift Card
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Redeem Modal */}
      <Dialog open={showRedeemModal} onOpenChange={setShowRedeemModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-led-purple/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-led-purple" />
              </div>
              Redeem Gift Card
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label>Gift Card Code</Label>
              <Input
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                className="h-14 text-lg font-mono rounded-xl text-center tracking-wider"
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-muted-foreground text-center">
                Enter the code from your gift card to add it to your wallet.
              </p>
            </div>
            <Button onClick={handleRedeem} className="w-full btn-primary h-12">
              Redeem Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

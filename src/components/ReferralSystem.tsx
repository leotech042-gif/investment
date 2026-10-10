import { useState } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import {
  Gift,
  Copy,
  Check,
  Users,
  DollarSign,
  Share2,
  Twitter,
  MessageCircle,
  Trophy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ReferralSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const REFERRAL_REWARDS = [
  {
    referrals: 1,
    reward: 5,
    description: "Get $5 for each friend who deposits $100+",
  },
  {
    referrals: 5,
    reward: 25,
    description: "Bonus $25 when you reach 5 referrals",
  },
  {
    referrals: 10,
    reward: 100,
    description: "Bonus $100 when you reach 10 referrals",
  },
];

export function ReferralSystem({ isOpen, onClose }: ReferralSystemProps) {
  const { referralCode, referralCount, referralEarnings } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `Join me on Invest Glowing and start earning! Use my referral code ${referralCode} to get started. 🌱💰`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      "_blank",
    );
  };

  const shareOnWhatsApp = () => {
    const text = `Join me on Invest Glowing! Use my referral code ${referralCode} ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-led-purple to-led-green flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            Refer & Earn
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-2xl bg-led-purple/5 text-center">
            <Users className="w-6 h-6 text-led-purple mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-foreground">
              {referralCount}
            </p>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </div>
          <div className="p-4 rounded-2xl bg-led-green/5 text-center">
            <DollarSign className="w-6 h-6 text-led-green mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-foreground">
              ${referralEarnings}
            </p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-led-purple to-led-green text-white">
          <p className="text-white/80 text-sm mb-2">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 font-mono text-2xl font-bold bg-white/20 px-4 py-3 rounded-xl text-center tracking-wider">
              {referralCode}
            </code>
            <button
              onClick={copyReferralCode}
              className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              {copied ? (
                <Check className="w-6 h-6" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Share via</p>
          <div className="flex gap-3">
            <button
              onClick={shareOnTwitter}
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-400/10 text-blue-500 hover:bg-blue-400/20 transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span className="font-medium">Twitter</span>
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">WhatsApp</span>
            </button>
            <button
              onClick={copyReferralLink}
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 text-foreground hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Copy Link</span>
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">How it works</p>
          <div className="space-y-2">
            {[
              { step: 1, text: "Share your referral code with friends" },
              { step: 2, text: "They sign up and verify their account" },
              { step: 3, text: "They deposit $100 or more" },
              { step: 4, text: "You both earn $5 bonus!" },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
              >
                <div className="w-6 h-6 rounded-full bg-led-purple text-white text-xs font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <span className="text-sm text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Tiers */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Reward Tiers</p>
          <div className="space-y-2">
            {REFERRAL_REWARDS.map((tier, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  referralCount >= tier.referrals
                    ? "bg-led-green/10 border border-led-green/30"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    referralCount >= tier.referrals
                      ? "bg-led-green text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {tier.referrals} Referrals
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-led-green">
                    ${tier.reward}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

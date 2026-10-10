import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { EnhancedLoginModal } from "./components/EnhancedLoginModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { EmailVerification } from "./components/EmailVerification";
import { KYCVerification } from "./components/KYCVerification";
import { CryptoWallets } from "./components/CryptoWallets";
import { ReferralSystem } from "./components/ReferralSystem";
import { HeroSection } from "./sections/HeroSection";
import { EcoDashboard } from "./sections/EcoDashboard";
import { FeatureSection } from "./sections/FeatureSection";
import { MarketSection } from "./sections/MarketSection";
import { WalletSection } from "./sections/WalletSection";
import { TradeSection } from "./sections/TradeSection";
import { GiftCardSection } from "./sections/GiftCardSection";
import { GiftCardMarketplace } from "./sections/GiftCardMarketplace";
import { EarnSection } from "./sections/EarnSection";
import { InvestIdeasSection } from "./sections/InvestIdeasSection";
import { AssetsSection } from "./sections/AssetsSection";
import { SecuritySection } from "./sections/SecuritySection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { CTAFooter } from "./sections/CTAFooter";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import "./App.css";
import "./index.css";

function MainContent() {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [showCryptoWallets, setShowCryptoWallets] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");

  useEffect(() => {
    if (referralCode) {
      sessionStorage.setItem("referralCode", referralCode);
      toast.info(`Referral code ${referralCode} applied!`, {
        description: "Sign up to earn rewards",
      });
    }
  }, [referralCode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("Welcome to Invest Glowing", {
        description: "Demo: demo@investglowing.com / Demo@123!",
        duration: 7000,
      });
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenLogin = (mode: "login" | "register" = "login") => {
    setLoginMode(mode);
    setShowLogin(true);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="grain-overlay" />

      <Navigation
        onOpenLogin={() => handleOpenLogin("login")}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenKYC={() => setShowKYC(true)}
        onOpenCryptoWallets={() => setShowCryptoWallets(true)}
        onOpenReferral={() => setShowReferral(true)}
      />

      <main className="relative">
        <HeroSection onOpenLogin={handleOpenLogin} />
        <EcoDashboard />
        <FeatureSection
          id="unified"
          eyebrow="ALL-IN-ONE"
          headline="One account. Many possibilities."
          body="Move between cash, crypto, and gift cards without switching apps. Everything stays connected, tracked, and secure."
          cardHeader="Unified balance view"
          cardMicrocopy="Real-time sync across assets. Tap any card to expand details."
          chips={["Cash", "Crypto", "Cards", "Ideas"]}
          glowColor="purple"
        />
        <FeatureSection
          id="transfers"
          eyebrow="TRANSFERS"
          headline="Send & receive in seconds."
          body="Transfers between members are instant. External wallets and banks are tracked with clear confirmations."
          pillText="Sent • $240.00"
          glowColor="green"
          reversed
        />
        <WalletSection />
        <MarketSection />
        <TradeSection />
        <GiftCardSection />
        <GiftCardMarketplace />
        <EarnSection />
        <InvestIdeasSection />
        <AssetsSection />
        <SecuritySection />
        <TestimonialsSection />
        <CTAFooter onOpenLogin={() => handleOpenLogin("register")} />
      </main>

      <EnhancedLoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        mode={loginMode}
        onSwitchMode={() =>
          setLoginMode(loginMode === "login" ? "register" : "login")
        }
      />

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      <KYCVerification isOpen={showKYC} onClose={() => setShowKYC(false)} />
      <CryptoWallets
        isOpen={showCryptoWallets}
        onClose={() => setShowCryptoWallets(false)}
      />
      <ReferralSystem
        isOpen={showReferral}
        onClose={() => setShowReferral(false)}
      />

      <Toaster position="top-right" richColors />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/*" element={<MainContent />} />
    </Routes>
  );
}

export default App;

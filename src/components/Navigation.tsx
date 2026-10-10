import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sprout,
  Menu,
  X,
  Wallet,
  TrendingUp,
  Gift,
  Shield,
  LogOut,
  User,
  Bell,
  ShieldCheck,
  Store,
  QrCode,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

interface NavigationProps {
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  onOpenKYC: () => void;
  onOpenCryptoWallets: () => void;
  onOpenReferral: () => void;
}

export function Navigation({
  onOpenLogin,
  onOpenAdmin,
  onOpenKYC,
  onOpenCryptoWallets,
  onOpenReferral,
}: NavigationProps) {
  const {
    isAuthenticated,
    user,
    logout,
    unreadCount,
    kycStatus,
    referralCount,
  } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Markets", href: "#markets", icon: TrendingUp },
    { label: "Wallet", href: "#wallet", icon: Wallet },
    { label: "Earn", href: "#earn", icon: Sprout },
    { label: "Gift Cards", href: "#giftcards", icon: Gift },
    { label: "Marketplace", href: "#giftcard-marketplace", icon: Store },
    { label: "Security", href: "#security", icon: Shield },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const getKYCStatusIcon = () => {
    switch (kycStatus) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4 text-led-green" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-card"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-led-purple to-led-green flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-lg text-foreground">
                Invest glowing
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/50 dark:hover:bg-white/10"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <ThemeToggle />

              {/* Admin Access */}
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-led-purple transition-colors rounded-lg hover:bg-led-purple/5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>

              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  {/* KYC Status */}
                  {kycStatus !== "verified" && (
                    <button
                      onClick={onOpenKYC}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                    >
                      {getKYCStatusIcon()}
                      <span>KYC</span>
                    </button>
                  )}

                  {/* Crypto Wallets */}
                  <button
                    onClick={onOpenCryptoWallets}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Wallets</span>
                  </button>

                  {/* Referral */}
                  <button
                    onClick={onOpenReferral}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-led-purple transition-colors rounded-lg hover:bg-led-purple/5"
                  >
                    <Users className="w-4 h-4" />
                    {referralCount > 0 && (
                      <span className="bg-led-green text-white text-xs px-1.5 py-0.5 rounded-full">
                        {referralCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications */}
                  <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Balance */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-white/10 rounded-xl border border-gray-200/50 dark:border-white/10">
                    <User className="w-4 h-4 text-led-purple" />
                    <span className="text-sm font-medium truncate max-w-[80px]">
                      {user?.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ${user?.balance.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={onOpenLogin}
                  className="btn-primary hidden sm:flex"
                >
                  Open account
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-[72px] left-4 right-4 bg-white dark:bg-gray-900 rounded-3xl shadow-card p-6 transition-all duration-300 ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <link.icon className="w-5 h-5 text-led-purple" />
                <span className="font-medium">{link.label}</span>
              </button>
            ))}

            {isAuthenticated && (
              <>
                <div className="border-t border-gray-100 dark:border-white/10 my-2" />
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCryptoWallets();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  <QrCode className="w-5 h-5 text-led-purple" />
                  <span className="font-medium">Crypto Wallets</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenReferral();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Users className="w-5 h-5 text-led-purple" />
                  <span className="font-medium">Refer & Earn</span>
                  {referralCount > 0 && (
                    <span className="ml-auto bg-led-green text-white text-xs px-2 py-0.5 rounded-full">
                      {referralCount}
                    </span>
                  )}
                </button>
                {kycStatus !== "verified" && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenKYC();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Complete KYC</span>
                  </button>
                )}
              </>
            )}

            <div className="border-t border-gray-100 dark:border-white/10 my-2" />

            {/* Admin Link Mobile */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-led-purple" />
              <span className="font-medium">Admin Dashboard</span>
            </button>

            <div className="border-t border-gray-100 dark:border-white/10 my-2" />

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <User className="w-5 h-5 text-led-purple" />
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${user?.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="btn-primary w-full"
              >
                Open account
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

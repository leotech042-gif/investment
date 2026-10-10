import { useState } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import {
  Bitcoin,
  Coins,
  Wallet,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CRYPTO_CONFIGS } from "@/data/enhancedDatabase";

interface CryptoWalletsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CRYPTO_ICONS: { [key: string]: React.ElementType } = {
  BTC: Bitcoin,
  ETH: Coins,
  SOL: Wallet,
  USDT: Wallet,
  BNB: Wallet,
  ADA: Wallet,
  DOT: Wallet,
  XRP: Wallet,
};

const CRYPTO_COLORS: { [key: string]: string } = {
  BTC: "from-orange-400 to-orange-600",
  ETH: "from-blue-500 to-purple-600",
  SOL: "from-purple-500 to-green-500",
  USDT: "from-green-500 to-teal-500",
  BNB: "from-yellow-400 to-yellow-600",
  ADA: "from-blue-600 to-blue-800",
  DOT: "from-pink-500 to-purple-600",
  XRP: "from-gray-700 to-black",
};

export function CryptoWallets({ isOpen, onClose }: CryptoWalletsProps) {
  const { cryptoWallets, getCryptoWallet } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showQR] = useState<string | null>(null);
  // Prevent unused variable warning
  if (showQR) console.log(showQR);

  const copyAddress = (address: string, symbol: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(symbol);
    toast.success(`${symbol} address copied!`);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const wallet = selectedWallet ? getCryptoWallet(selectedWallet) : null;
  const config = selectedWallet
    ? CRYPTO_CONFIGS[selectedWallet as keyof typeof CRYPTO_CONFIGS]
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-led-purple to-led-green flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            Crypto Wallets
          </DialogTitle>
        </DialogHeader>

        {/* Wallet List with safe fallback */}
        <div className="space-y-3 mt-4">
          {(cryptoWallets || []).map((wallet) => {
            const Icon = CRYPTO_ICONS[wallet.symbol] || Wallet;
            const gradient =
              CRYPTO_COLORS[wallet.symbol] || "from-gray-400 to-gray-600";

            return (
              <div
                key={wallet.id}
                onClick={() => setSelectedWallet(wallet.symbol)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{wallet.name}</p>
                    <span className="text-xs text-muted-foreground">
                      ({wallet.symbol})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {wallet.network}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold">{wallet.balance}</p>
                  <p className="text-xs text-muted-foreground">
                    {wallet.symbol}
                  </p>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            );
          })}
        </div>

        {/* Selected Wallet Details */}
        {wallet && config && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-led-purple/5 to-led-green/5 border border-led-purple/10">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CRYPTO_COLORS[wallet.symbol]} flex items-center justify-center`}
              >
                {(() => {
                  const Icon = CRYPTO_ICONS[wallet.symbol] || Wallet;
                  return <Icon className="w-5 h-5 text-white" />;
                })()}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {wallet.name} Wallet
                </p>
                <p className="text-xs text-muted-foreground">
                  {wallet.network}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">Deposit Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs bg-white px-3 py-2 rounded-lg border break-all">
                  {wallet.address}
                </code>
                <button
                  onClick={() => copyAddress(wallet.address, wallet.symbol)}
                  className="p-2 rounded-lg bg-white border hover:bg-gray-50 transition-colors"
                >
                  {copiedAddress === wallet.symbol ? (
                    <Check className="w-4 h-4 text-led-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-4">
              <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center border">
                <QrCode className="w-24 h-24 text-gray-300" />
              </div>
            </div>

            {/* Info */}
            <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-700">
                  <p className="font-medium">Important:</p>
                  <p>
                    Send only {wallet.symbol} to this address. Min deposit:{" "}
                    {config.minDeposit} {wallet.symbol}
                  </p>
                  <p>Confirmations required: {config.confirmations}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() =>
                window.open(
                  `https://explorer.com/address/${wallet.address}`,
                  "_blank",
                )
              }
              variant="outline"
              className="w-full mt-4"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

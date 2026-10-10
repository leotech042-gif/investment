import { useState, useEffect, useRef } from "react";
import {
  Wallet,
  Bitcoin,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  QrCode,
  Copy,
  Check,
  Plus,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/EnhancedAuthContext"; // ← FIXED
import { toast } from "sonner";
import { format } from "date-fns";

export function WalletSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Bank account form
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">(
    "checking",
  );

  const {
    isAuthenticated,
    user,
    bankAccounts,
    cryptoWallets,
    transactions,
    createTransaction,
    addBankAccount,
  } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const walletAddress =
    cryptoWallets[0]?.address || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleAction = (action: "deposit" | "withdraw") => {
    if (!isAuthenticated) {
      toast.error("Please log in to access your wallet");
      return;
    }
    if (action === "deposit") {
      setShowDepositModal(true);
    } else {
      setShowWithdrawModal(true);
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount < 15) {
      toast.error("Minimum deposit is $15");
      return;
    }

    await createTransaction(
      "deposit",
      amount,
      "USD",
      `Bank deposit from ${bankAccounts[0]?.bankName || "Bank"}`,
    );
    setShowDepositModal(false);
    setDepositAmount("");
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!user || user.balance < amount) {
      toast.error("Insufficient balance");
      return;
    }

    await createTransaction(
      "withdrawal",
      amount,
      "USD",
      `Withdrawal to ${bankAccounts[0]?.bankName || "Bank"}`,
    );
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  const handleAddBankAccount = async () => {
    if (!bankName || !accountNumber || !routingNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    await addBankAccount({
      accountName: "Primary Account",
      bankName,
      accountNumber: "****" + accountNumber.slice(-4),
      routingNumber,
      accountType,
    });

    setShowAddBankModal(false);
    setBankName("");
    setAccountNumber("");
    setRoutingNumber("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-led-green" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Safer asset data that works with EnhancedAuthContext
  const btcWallet = cryptoWallets.find((w) => w.symbol === "BTC");
  const ethWallet = cryptoWallets.find((w) => w.symbol === "ETH");

  const assets = [
    {
      symbol: "USD",
      name: "Cash",
      balance: user?.balance ?? 0,
      icon: Wallet,
      color: "bg-led-green",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: btcWallet?.balance ?? 0,
      icon: Bitcoin,
      color: "bg-orange-500",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: ethWallet?.balance ?? 0,
      icon: Coins,
      color: "bg-blue-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="wallet"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/feature_bg_farm_04.jpg)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(246,247,250,0.9) 0%, rgba(246,247,250,0.5) 50%, rgba(246,247,250,0.9) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Block */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-wider text-led-purple mb-4 block">
              WALLET
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">
              Your wallet, crystal clear.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              See exactly what you own, where it's stored, and how it's
              trending—without clutter.
            </p>

            {/* Wallet Address */}
            <div className="glass-card p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                Your Wallet Address
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg truncate">
                  {walletAddress}
                </code>
                <button
                  onClick={copyAddress}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {copiedAddress ? (
                    <Check className="w-5 h-5 text-led-green" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="glass-card p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                  Linked Bank Accounts
                </p>
                <button
                  onClick={() => setShowAddBankModal(true)}
                  className="text-sm text-led-purple hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
              {bankAccounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No bank accounts linked
                </p>
              ) : (
                <div className="space-y-2">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/50"
                    >
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{account.bankName}</span>
                      <span className="text-sm text-muted-foreground">
                        {account.accountNumber}
                      </span>
                      {account.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-led-green ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => handleAction("deposit")}
                className="btn-primary"
              >
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button
                onClick={() => handleAction("withdraw")}
                variant="outline"
                className="btn-secondary"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
              <Button
                onClick={() => setShowHistoryModal(true)}
                variant="outline"
                className="btn-secondary"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </div>

          {/* Wallet Card */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <div className="glass-card led-glow-purple p-6">
              {/* Total Balance */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Balance
                </p>
                <p className="font-display font-bold text-4xl text-foreground">
                  $
                  {user?.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-led-green/10 text-led-green text-sm">
                    <ArrowUpRight className="w-3 h-3" />
                    +12.5%
                  </div>
                  <span className="text-sm text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </div>

              {/* Assets List */}
              <div className="space-y-4 mb-6">
                {assets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${asset.color} flex items-center justify-center`}
                      >
                        <asset.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {asset.name}
                        </p>
                        <p className="font-mono text-sm text-muted-foreground">
                          {asset.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-foreground">
                        {asset.symbol === "USD" ? "$" : ""}
                        {asset.balance.toLocaleString("en-US", {
                          minimumFractionDigits: asset.symbol === "USD" ? 2 : 4,
                          maximumFractionDigits: asset.symbol === "USD" ? 2 : 6,
                        })}
                      </p>
                      <p className="font-mono text-sm text-muted-foreground">
                        {asset.symbol === "USD"
                          ? ""
                          : `$${(asset.balance * (asset.symbol === "BTC" ? 70885.96 : asset.symbol === "ETH" ? 2074.36 : 1)).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Crypto Wallets */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-foreground">Crypto Wallets</p>
                  <button
                    onClick={() => toast.info("Add wallet feature coming soon")}
                    className="text-sm text-led-purple hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {cryptoWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/50"
                    >
                      <span className="font-mono text-sm font-medium">
                        {wallet.symbol}
                      </span>
                      <code className="flex-1 font-mono text-xs text-muted-foreground truncate">
                        {wallet.address.slice(0, 8)}...
                        {wallet.address.slice(-8)}
                      </code>
                      <span className="font-mono text-sm">
                        {wallet.balance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              Deposit Funds
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="bank" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="space-y-4">
              {bankAccounts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    No bank account linked
                  </p>
                  <Button
                    onClick={() => {
                      setShowDepositModal(false);
                      setShowAddBankModal(true);
                    }}
                    className="btn-primary"
                  >
                    Add Bank Account
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>From Bank Account</Label>
                    <div className="flex items-center gap-3 p-3 border rounded-xl">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">
                        {bankAccounts[0].bankName}{" "}
                        {bankAccounts[0].accountNumber}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="pl-8 rounded-xl"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum deposit: $15
                    </p>
                  </div>
                  <Button
                    onClick={handleDeposit}
                    className="w-full btn-primary"
                  >
                    Submit Deposit Request
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Deposits require admin approval. You'll be notified once
                    approved.
                  </p>
                </>
              )}
            </TabsContent>

            <TabsContent value="crypto" className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">
                  Your Wallet Address
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-xs bg-white px-3 py-2 rounded-lg truncate">
                    {walletAddress}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-2 rounded-lg hover:bg-white transition-colors"
                  >
                    {copiedAddress ? (
                      <Check className="w-4 h-4 text-led-green" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-gray-400" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Scan to deposit crypto
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              Withdraw Funds
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="bank" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="space-y-4">
              {bankAccounts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    No bank account linked
                  </p>
                  <Button
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setShowAddBankModal(true);
                    }}
                    className="btn-primary"
                  >
                    Add Bank Account
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>To Bank Account</Label>
                    <div className="flex items-center gap-3 p-3 border rounded-xl">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">
                        {bankAccounts[0].bankName}{" "}
                        {bankAccounts[0].accountNumber}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="pl-8 rounded-xl"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Available: ${user?.balance.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    className="w-full btn-primary"
                  >
                    Submit Withdrawal Request
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Withdrawals require admin approval. You'll be notified once
                    approved.
                  </p>
                </>
              )}
            </TabsContent>

            <TabsContent value="crypto" className="space-y-4">
              <div className="space-y-2">
                <Label>Recipient Address</Label>
                <Input placeholder="0x..." className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="rounded-xl"
                />
              </div>
              <Button className="w-full btn-primary">Send Crypto</Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Bank Account Modal */}
      <Dialog open={showAddBankModal} onOpenChange={setShowAddBankModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              Add Bank Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Bank Name</Label>
              <Input
                placeholder="e.g., Chase Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                placeholder="0000000000"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label>Routing Number</Label>
              <Input
                placeholder="000000000"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label>Account Type</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAccountType("checking")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    accountType === "checking"
                      ? "bg-led-purple text-white"
                      : "bg-gray-100 text-muted-foreground"
                  }`}
                >
                  Checking
                </button>
                <button
                  onClick={() => setAccountType("savings")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    accountType === "savings"
                      ? "bg-led-purple text-white"
                      : "bg-gray-100 text-muted-foreground"
                  }`}
                >
                  Savings
                </button>
              </div>
            </div>
            <Button
              onClick={handleAddBankAccount}
              className="w-full btn-primary"
            >
              Add Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="sm:max-w-lg bg-white rounded-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              Transaction History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet
              </p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(tx.status)}
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {tx.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tx.createdAt), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-mono font-semibold ${
                        tx.type === "deposit" ||
                        tx.type === "giftcard_redeem" ||
                        tx.type === "earning"
                          ? "text-led-green"
                          : "text-red-500"
                      }`}
                    >
                      {tx.type === "deposit" ||
                      tx.type === "giftcard_redeem" ||
                      tx.type === "earning"
                        ? "+"
                        : "-"}
                      ${tx.amount.toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.status === "completed" || tx.status === "approved"
                          ? "bg-led-green/10 text-led-green"
                          : tx.status === "rejected"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

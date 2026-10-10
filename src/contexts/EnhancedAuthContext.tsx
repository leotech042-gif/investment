/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";
import {
  enhancedDb,
  type User,
  type Transaction,
  type BankAccount,
  type CryptoWallet,
  type GiftCard,
  type GiftCardListing,
  type Investment,
  type Notification,
  type ReferralReward,
} from "@/data/enhancedDatabase";

interface AuthContextType {
  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  admin: { id: string; email: string; name: string; role: string } | null;

  // Login/Register
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Email verification
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;

  // KYC
  kycStatus: "not_started" | "pending" | "verified" | "rejected";
  submitBVN: (bvn: string) => Promise<{ success: boolean; error?: string }>;
  submitKYC: (data: KYCData) => Promise<boolean>;

  // Wallet & Balance
  balance: number;
  canDeposit: boolean;
  canWithdraw: boolean;

  // Transactions
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  createTransaction: (
    type: Transaction["type"],
    amount: number,
    currency: string,
    description?: string,
    metadata?: Record<string, unknown>,
  ) => Promise<Transaction | null>;
  approveTransaction: (txId: string, note?: string) => Promise<boolean>;
  rejectTransaction: (txId: string, reason: string) => Promise<boolean>;
  refreshTransactions: () => void;

  // Bank Accounts
  bankAccounts: BankAccount[];
  addBankAccount: (data: BankAccountData) => Promise<BankAccount | null>;

  // Crypto Wallets
  cryptoWallets: CryptoWallet[];
  getCryptoWallet: (symbol: string) => CryptoWallet | undefined;

  // Gift Cards
  giftCards: GiftCard[];
  createGiftCard: (
    brand: string,
    code: string,
    value: number,
  ) => Promise<GiftCard | null>;

  // Gift Card Marketplace
  giftCardListings: GiftCardListing[];
  createGiftCardListing: (
    brand: string,
    value: number,
    askingPrice: number,
  ) => Promise<GiftCardListing | null>;
  buyGiftCard: (
    listingId: string,
  ) => Promise<{ success: boolean; message: string }>;
  refreshListings: () => void;

  // Investments
  investments: Investment[];
  createInvestment: (
    name: string,
    category: string,
    amount: number,
    apy: number,
  ) => Promise<Investment | null>;

  // Referrals
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  referralRewards: ReferralReward[];

  // Notifications
  notifications: Notification[];
  markNotificationRead: (notifId: string) => void;
  unreadCount: number;

  // Stats
  stats: {
    totalUsers: number;
    totalTransactions: number;
    pendingTransactions: number;
    totalVolume: number;
    activeGiftCardListings: number;
    totalInvestments: number;
    totalReferralRewards: number;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  referralCode?: string;
}

interface KYCData {
  idType: "bvn" | "nin" | "passport" | "drivers_license" | "voters_card";
  idNumber: string;
  idDocumentUrl: string;
  selfieUrl: string;
}

interface BankAccountData {
  accountName: string;
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
  accountType: "checking" | "savings";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function EnhancedAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [admin, setAdmin] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
  } | null>(null);

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>(
    [],
  );
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [giftCardListings, setGiftCardListings] = useState<GiftCardListing[]>(
    [],
  );
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    totalVolume: 0,
    activeGiftCardListings: 0,
    totalInvestments: 0,
    totalReferralRewards: 0,
  });

  // ==================== HELPER REFRESH METHODS ====================

  const refreshUserData = useCallback(() => {
    if (!user) return;

    setTransactions(enhancedDb.getUserTransactions(user.id));
    setBankAccounts(user.bankAccounts || []);
    setCryptoWallets(user.cryptoWallets || []);
    setGiftCards(enhancedDb.getUserGiftCards(user.id));
    setInvestments(enhancedDb.getUserInvestments(user.id));
    setReferralRewards(enhancedDb.getReferralRewards(user.id));
    setNotifications(enhancedDb.getUserNotifications(user.id));
    setStats(enhancedDb.getStats());
  }, [user]);

  const refreshTransactions = useCallback(() => {
    if (!user) return;
    setTransactions(enhancedDb.getUserTransactions(user.id));
    setPendingTransactions(enhancedDb.getPendingTransactions());
    setStats(enhancedDb.getStats());
  }, [user]);

  const refreshListings = useCallback(() => {
    setGiftCardListings(enhancedDb.getActiveListings());
    setStats(enhancedDb.getStats());
  }, []);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshUserData();
    }
  }, [user, refreshUserData]);

  // ==================== AUTH METHODS ====================

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      // Demo credentials check
      if (email === "demo@investglowing.com" && password === "Demo@123!") {
        const demoUser = enhancedDb.getUserByEmail("demo@investglowing.com");
        if (demoUser) {
          demoUser.lastLoginAt = new Date().toISOString();
          enhancedDb.updateUser(demoUser);
          setUser(demoUser);
          enhancedDb.setCurrentUser(demoUser);
          setIsAuthenticated(true);
          setIsAdmin(false);
          refreshUserData();
          toast.success("Welcome back to Invest Glowing!");
          return true;
        }
      }

      // Check database
      const foundUser = enhancedDb.getUserByEmail(email);
      if (foundUser && foundUser.password === password) {
        if (!foundUser.isEmailVerified) {
          toast.error("Please verify your email before logging in");
          return false;
        }
        if (foundUser.isSuspended) {
          toast.error(
            `Account suspended: ${foundUser.suspensionReason || "Contact support"}`,
          );
          return false;
        }

        foundUser.lastLoginAt = new Date().toISOString();
        enhancedDb.updateUser(foundUser);
        setUser(foundUser);
        enhancedDb.setCurrentUser(foundUser);
        setIsAuthenticated(true);
        setIsAdmin(false);
        refreshUserData();
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      }

      toast.error("Invalid credentials");
      return false;
    },
    [refreshUserData],
  );

  const adminLogin = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      if (email === "admin@investglowing.com" && password === "Admin@123!") {
        const foundAdmin = enhancedDb.getAdminByEmail(
          "admin@investglowing.com",
        );
        if (foundAdmin) {
          setAdmin(foundAdmin);
          setIsAdmin(true);
          setIsAuthenticated(false);
          setPendingTransactions(enhancedDb.getPendingTransactions());
          setStats(enhancedDb.getStats());
          toast.success("Welcome to Admin Dashboard!");
          return true;
        }
      }
      toast.error("Invalid admin credentials");
      return false;
    },
    [],
  );

  const register = useCallback(
    async (
      data: RegisterData,
    ): Promise<{ success: boolean; error?: string }> => {
      // Validate password
      const passwordValidation = enhancedDb.validatePassword(data.password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.errors.join(", ") };
      }

      const result = enhancedDb.createUser(
        data.email,
        data.name,
        data.password,
        data.dateOfBirth,
        data.referralCode,
      );

      if (!result.success) {
        return result;
      }

      // Show email verification message
      toast.success(
        "Account created! Please check your email to verify your account.",
        {
          duration: 8000,
        },
      );

      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setAdmin(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    enhancedDb.setCurrentUser(null);
    toast.info("You have been logged out.");
  }, []);

  // ==================== EMAIL VERIFICATION ====================

  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    const result = enhancedDb.verifyEmail(token);
    if (result.success) {
      toast.success("Email verified successfully! You can now log in.");
    } else {
      toast.error(result.error || "Verification failed");
    }
    return result.success;
  }, []);

  const resendVerificationEmail = useCallback(async (): Promise<void> => {
    toast.info("Verification email sent! Please check your inbox.");
  }, []);

  // ==================== KYC METHODS ====================

  const submitBVN = useCallback(
    async (bvn: string): Promise<{ success: boolean; error?: string }> => {
      if (!user) return { success: false, error: "Not logged in" };

      const result = enhancedDb.verifyBVN(user.id, bvn);
      if (result.success) {
        const updatedUser = enhancedDb.getUser(user.id);
        if (updatedUser) {
          setUser(updatedUser);
          toast.success("BVN verified successfully!");
        }
      }
      return result;
    },
    [user],
  );

  const submitKYC = useCallback(
    async (data: KYCData): Promise<boolean> => {
      if (!user) {
        toast.error("Not logged in");
        return false;
      }

      enhancedDb.submitKYC(
        user.id,
        data.idType,
        data.idNumber,
        data.idDocumentUrl,
        data.selfieUrl,
      );
      const updatedUser = enhancedDb.getUser(user.id);
      if (updatedUser) {
        setUser(updatedUser);
        toast.success("KYC documents submitted for review");
      }
      return true;
    },
    [user],
  );

  // ==================== TRANSACTION METHODS ====================

  const createTransaction = useCallback(
    async (
      type: Transaction["type"],
      amount: number,
      currency: string,
      description?: string,
      metadata?: Record<string, unknown>,
    ): Promise<Transaction | null> => {
      if (!user) return null;

      // Check KYC for deposits/withdrawals
      if ((type === "deposit" || type === "withdrawal") && user.kycLevel < 2) {
        toast.error(
          "Please complete KYC verification (BVN) to make deposits/withdrawals",
        );
        return null;
      }

      const transaction = enhancedDb.createTransaction({
        userId: user.id,
        type,
        amount,
        currency,
        status:
          type === "deposit" || type === "withdrawal" ? "pending" : "completed",
        description,
        metadata,
      });

      refreshTransactions();

      if (transaction.status === "pending") {
        toast.info("Transaction submitted for admin approval");
      } else {
        toast.success("Transaction completed");
      }

      return transaction;
    },
    [user, refreshTransactions],
  );

  const approveTransaction = useCallback(
    async (txId: string, note?: string): Promise<boolean> => {
      if (!admin) return false;

      const result = enhancedDb.approveTransaction(txId, admin.id, note);
      if (result) {
        refreshTransactions();
        toast.success("Transaction approved");
        return true;
      }
      return false;
    },
    [admin, refreshTransactions],
  );

  const rejectTransaction = useCallback(
    async (txId: string, reason: string): Promise<boolean> => {
      if (!admin) return false;

      const result = enhancedDb.rejectTransaction(txId, admin.id, reason);
      if (result) {
        refreshTransactions();
        toast.success("Transaction rejected");
        return true;
      }
      return false;
    },
    [admin, refreshTransactions],
  );

  // ==================== BANK ACCOUNT METHODS ====================

  const addBankAccount = useCallback(
    async (data: BankAccountData): Promise<BankAccount | null> => {
      if (!user) return null;

      // Check KYC
      if (user.kycLevel < 2) {
        toast.error("Please complete BVN verification to add a bank account");
        return null;
      }

      const newAccount = enhancedDb.addBankAccount(user.id, {
        ...data,
        isVerified: true,
        isDefault: user.bankAccounts.length === 0,
      });

      const updatedUser = enhancedDb.getUser(user.id);
      if (updatedUser) {
        setUser(updatedUser);
        setBankAccounts(updatedUser.bankAccounts);
      }

      toast.success("Bank account added successfully");
      return newAccount;
    },
    [user],
  );

  // ==================== CRYPTO WALLET METHODS ====================

  const getCryptoWallet = useCallback(
    (symbol: string): CryptoWallet | undefined => {
      if (!user) return undefined;
      return enhancedDb.getCryptoWallet(user.id, symbol);
    },
    [user],
  );

  // ==================== GIFT CARD METHODS ====================

  const createGiftCard = useCallback(
    async (
      brand: string,
      code: string,
      value: number,
    ): Promise<GiftCard | null> => {
      if (!user) return null;

      const giftCard = enhancedDb.createGiftCard(user.id, brand, code, value);
      refreshUserData();
      toast.success(`${brand} gift card added`);
      return giftCard;
    },
    [user, refreshUserData],
  );

  // ==================== GIFT CARD MARKETPLACE ====================

  const createGiftCardListing = useCallback(
    async (
      brand: string,
      value: number,
      askingPrice: number,
    ): Promise<GiftCardListing | null> => {
      if (!user) return null;

      const discount = Math.round(((value - askingPrice) / value) * 100);
      const listing = enhancedDb.createGiftCardListing({
        sellerId: user.id,
        sellerName: user.name,
        brand,
        value,
        askingPrice,
        discount,
        status: "active",
      });

      refreshListings();
      toast.success("Gift card listed for sale");
      return listing;
    },
    [user, refreshListings],
  );

  const buyGiftCard = useCallback(
    async (
      listingId: string,
    ): Promise<{ success: boolean; message: string }> => {
      if (!user) return { success: false, message: "Please log in" };

      const result = enhancedDb.buyGiftCard(listingId, user.id);
      if (result.success) {
        refreshUserData();
        refreshListings();
      }
      return result;
    },
    [user, refreshUserData, refreshListings],
  );

  // ==================== INVESTMENT METHODS ====================

  const createInvestment = useCallback(
    async (
      name: string,
      category: string,
      amount: number,
      apy: number,
    ): Promise<Investment | null> => {
      if (!user) {
        toast.error("Please log in");
        return null;
      }

      if (amount < 15) {
        toast.error("Minimum investment is $15");
        return null;
      }

      if (user.balance < amount) {
        toast.error("Insufficient balance");
        return null;
      }

      const investment = enhancedDb.createInvestment(
        user.id,
        name,
        category,
        amount,
        apy,
      );
      if (investment) {
        refreshUserData();
        toast.success(`Invested $${amount} in ${name}`);
        return investment;
      }
      return null;
    },
    [user, refreshUserData],
  );

  // ==================== NOTIFICATION METHODS ====================

  const markNotificationRead = useCallback(
    (notifId: string) => {
      enhancedDb.markNotificationRead(notifId);
      if (user) {
        setNotifications(enhancedDb.getUserNotifications(user.id));
      }
    },
    [user],
  );

  // ==================== COMPUTED VALUES ====================

  const canDeposit = Boolean(
    (user?.kycLevel ?? 0) >= 2 && user?.isEmailVerified && !user?.isSuspended,
  );
  const canWithdraw = Boolean(
    (user?.kycLevel ?? 0) >= 2 &&
    user?.isEmailVerified &&
    !user?.isSuspended &&
    (user?.balance ?? 0) > 0,
  );
  const kycStatus = user?.kycStatus || "not_started";
  const referralCode = user?.referralCode || "";
  const referralCount = user?.referralCount || 0;
  const referralEarnings = user?.referralEarnings || 0;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAdmin,
        admin,
        login,
        adminLogin,
        register,
        logout,
        verifyEmail,
        resendVerificationEmail,
        kycStatus,
        submitBVN,
        submitKYC,
        balance: user?.balance || 0,
        canDeposit,
        canWithdraw,
        transactions,
        pendingTransactions,
        createTransaction,
        approveTransaction,
        rejectTransaction,
        refreshTransactions,
        bankAccounts,
        addBankAccount,
        cryptoWallets,
        getCryptoWallet,
        giftCards,
        createGiftCard,
        giftCardListings,
        createGiftCardListing,
        buyGiftCard,
        refreshListings,
        investments,
        createInvestment,
        referralCode,
        referralCount,
        referralEarnings,
        referralRewards,
        notifications,
        markNotificationRead,
        unreadCount,
        stats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an EnhancedAuthProvider");
  }
  return context;
}

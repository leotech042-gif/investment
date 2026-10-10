/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  // useEffect,
} from "react";
import { toast } from "sonner";
import {
  db,
  type User,
  type Transaction,
  type BankAccount,
  type CryptoWallet,
  type GiftCard,
  type GiftCardListing,
  type Investment,
  type Notification,
} from "@/data/database";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  admin: { id: string; email: string; name: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Wallet & Balance
  balance: number;
  updateBalance: (amount: number) => void;

  // Transactions
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  createTransaction: (
    type: Transaction["type"],
    amount: number,
    currency: string,
    description?: string,
  ) => Promise<Transaction | null>;
  approveTransaction: (txId: string, note?: string) => Promise<boolean>;
  rejectTransaction: (txId: string, reason: string) => Promise<boolean>;
  refreshTransactions: () => void;

  // Bank Accounts
  bankAccounts: BankAccount[];
  addBankAccount: (
    account: Omit<BankAccount, "id" | "userId" | "addedAt">,
  ) => Promise<BankAccount | null>;

  // Crypto Wallets
  cryptoWallets: CryptoWallet[];
  createCryptoWallet: (symbol: string) => Promise<CryptoWallet | null>;

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
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    totalVolume: 0,
    activeGiftCardListings: 0,
    totalInvestments: 0,
  });

  // ==================== HELPER REFRESH METHODS ====================

  const refreshUserData = useCallback(() => {
    if (!user) return;

    setTransactions(db.getUserTransactions(user.id));
    setBankAccounts(user.bankAccounts);
    setCryptoWallets(user.cryptoWallets);
    setGiftCards(db.getUserGiftCards(user.id));
    setInvestments(db.getUserInvestments(user.id));
    setNotifications(db.getUserNotifications(user.id));
    setStats(db.getStats());
  }, [user]);

  const refreshTransactions = useCallback(() => {
    if (!user) return;
    setTransactions(db.getUserTransactions(user.id));
    setPendingTransactions(db.getPendingTransactions());
    setStats(db.getStats());
  }, [user]);

  const refreshListings = useCallback(() => {
    setGiftCardListings(db.getActiveListings());
    setStats(db.getStats());
  }, []);

  // Load data when user changes
  // useEffect(() => {
  //   if (user) {
  //     refreshUserData();
  //   }
  // }, [user, refreshUserData]);

  // ==================== AUTH METHODS ====================

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      // Demo credentials check
      if (email === "demo@investglowing.com" && password === "demo123") {
        const demoUser = db.getUserByEmail("demo@investglowing.com");
        if (demoUser) {
          setUser(demoUser);
          db.setCurrentUser(demoUser);
          setIsAuthenticated(true);
          setIsAdmin(false);
          refreshUserData();
          toast.success("Welcome back to Invest Glowing!");
          return true;
        }
      }

      // Check database
      const foundUser = db.getUserByEmail(email);
      if (foundUser && foundUser.password === password) {
        setUser(foundUser);
        db.setCurrentUser(foundUser);
        setIsAuthenticated(true);
        setIsAdmin(false);
        refreshUserData();
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      }

      toast.error("Invalid credentials. Try demo@investglowing.com / demo123");
      return false;
    },
    [refreshUserData],
  );

  const adminLogin = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      if (email === "admin@investglowing.com" && password === "admin123") {
        const foundAdmin = db.getAdminByEmail("admin@investglowing.com");
        if (foundAdmin) {
          setAdmin(foundAdmin);
          setIsAdmin(true);
          setIsAuthenticated(false);
          setPendingTransactions(db.getPendingTransactions());
          setStats(db.getStats());
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
    async (name: string, email: string, password: string): Promise<boolean> => {
      // Check if email already exists
      const existingUser = db.getUserByEmail(email);
      if (existingUser) {
        toast.error("Email already registered");
        return false;
      }

      const newUser = db.createUser(email, name, password);

      // Create default wallets
      db.createCryptoWallet(newUser.id, "BTC");
      db.createCryptoWallet(newUser.id, "ETH");

      // Reload user with wallets
      const updatedUser = db.getUser(newUser.id);
      if (updatedUser) {
        setUser(updatedUser);
        db.setCurrentUser(updatedUser);
        setIsAuthenticated(true);
        setIsAdmin(false);
        refreshUserData();
      }

      toast.success("Account created successfully! Welcome to Invest Glowing.");
      return true;
    },
    [refreshUserData],
  );

  const logout = useCallback(() => {
    setUser(null);
    setAdmin(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    db.setCurrentUser(null);
    toast.info("You have been logged out.");
  }, []);

  // ==================== BALANCE METHODS ====================

  const updateBalance = useCallback(
    (amount: number) => {
      if (user) {
        const updatedUser = { ...user, balance: user.balance + amount };
        db.updateUser(updatedUser);
        setUser(updatedUser);
      }
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
    ): Promise<Transaction | null> => {
      if (!user) return null;

      const transaction = db.createTransaction({
        userId: user.id,
        type,
        amount,
        currency,
        status:
          type === "deposit" || type === "withdrawal" ? "pending" : "completed",
        description,
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

      const result = db.approveTransaction(txId, admin.id, note);
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

      const result = db.rejectTransaction(txId, admin.id, reason);
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
    async (
      account: Omit<BankAccount, "id" | "userId" | "addedAt">,
    ): Promise<BankAccount | null> => {
      if (!user) return null;

      const newAccount = db.addBankAccount(user.id, account);
      refreshUserData();
      toast.success("Bank account added successfully");
      return newAccount;
    },
    [user, refreshUserData],
  );

  // ==================== CRYPTO WALLET METHODS ====================

  const createCryptoWallet = useCallback(
    async (symbol: string): Promise<CryptoWallet | null> => {
      if (!user) return null;

      const wallet = db.createCryptoWallet(user.id, symbol);
      refreshUserData();
      toast.success(`${symbol} wallet created`);
      return wallet;
    },
    [user, refreshUserData],
  );

  // ==================== GIFT CARD METHODS ====================

  const createGiftCard = useCallback(
    async (
      brand: string,
      code: string,
      value: number,
    ): Promise<GiftCard | null> => {
      if (!user) return null;

      const giftCard = db.createGiftCard(user.id, brand, code, value);
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
      const listing = db.createGiftCardListing({
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

      const result = db.buyGiftCard(listingId, user.id);
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

      const investment = db.createInvestment(
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
      db.markNotificationRead(notifId);
      if (user) {
        setNotifications(db.getUserNotifications(user.id));
      }
    },
    [user],
  );

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
        balance: user?.balance || 0,
        updateBalance,
        transactions,
        pendingTransactions,
        createTransaction,
        approveTransaction,
        rejectTransaction,
        refreshTransactions,
        bankAccounts,
        addBankAccount,
        cryptoWallets,
        createCryptoWallet,
        giftCards,
        createGiftCard,
        giftCardListings,
        createGiftCardListing,
        buyGiftCard,
        refreshListings,
        investments,
        createInvestment,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

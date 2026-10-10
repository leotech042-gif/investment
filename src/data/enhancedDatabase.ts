// Invest Glowing - Enhanced Database with Full KYC, Verification & Referral System
// Real bank: Moniepoint MFB - 7033972605

import { v4 as uuidv4 } from "uuid";

// ==================== TYPES ====================

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  dateOfBirth: string;
  age: number;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: string;

  // KYC
  kycStatus: "not_started" | "pending" | "verified" | "rejected";
  kycLevel: 0 | 1 | 2 | 3; // 0=None, 1=Basic, 2=BVN, 3=Full ID
  bvn?: string;
  bvnVerified: boolean;
  nin?: string;
  passportNumber?: string;
  idType?: "bvn" | "nin" | "passport" | "drivers_license" | "voters_card";
  idDocumentUrl?: string;
  selfieUrl?: string;
  faceVerified: boolean;

  // Referral
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarnings: number;

  // Balance & Portfolio
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  createdAt: string;
  lastLoginAt?: string;

  portfolio: {
    cash: number;
    crypto: { [symbol: string]: number };
    giftCards: string[];
    investments: { [id: string]: number };
  };

  // Accounts
  bankAccounts: BankAccount[];
  cryptoWallets: CryptoWallet[];

  // Status
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
  accountType: "checking" | "savings";
  isVerified: boolean;
  isDefault: boolean;
  addedAt: string;
  // For display purposes (random bank name)
  displayBankName: string;
}

export interface CryptoWallet {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  address: string;
  qrCode?: string;
  balance: number;
  network: string;
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type:
    | "deposit"
    | "withdrawal"
    | "buy"
    | "sell"
    | "transfer"
    | "giftcard_redeem"
    | "giftcard_send"
    | "investment"
    | "earning"
    | "referral_bonus";
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "completed";
  from?: string;
  to?: string;
  fee?: number;
  description?: string;
  adminNote?: string;
  approvedBy?: string;
  approvedAt?: string;
  metadata?: {
    bankName?: string;
    accountNumber?: string;
    cryptoAddress?: string;
    txHash?: string;
    referralCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GiftCard {
  id: string;
  ownerId: string;
  brand: string;
  code: string;
  originalValue: number;
  currentBalance: number;
  isForSale: boolean;
  salePrice?: number;
  expiryDate?: string;
  createdAt: string;
  transactions: GiftCardTransaction[];
}

export interface GiftCardTransaction {
  id: string;
  type: "purchase" | "sale" | "redeem" | "transfer";
  fromUserId: string;
  toUserId: string;
  amount: number;
  date: string;
}

export interface GiftCardListing {
  id: string;
  sellerId: string;
  sellerName: string;
  brand: string;
  value: number;
  askingPrice: number;
  discount: number;
  listedAt: string;
  status: "active" | "sold" | "cancelled";
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  apy: number;
  startDate: string;
  endDate?: string;
  status: "active" | "matured" | "withdrawn";
  returns: number;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "moderator";
  permissions: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: "transaction" | "approval" | "market" | "system" | "referral" | "kyc";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReferralReward {
  id: string;
  referrerId: string;
  referredId: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

export interface KYCSubmission {
  id: string;
  userId: string;
  idType: string;
  idNumber: string;
  idDocumentUrl: string;
  selfieUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// ==================== CONFIGURATION ====================

// Real bank details (hidden from users)
export const REAL_BANK_CONFIG = {
  bankName: "Moniepoint MFB",
  accountNumber: "7033972605",
  accountName: "Invest Glowing - Lëø Têçh",
};

// Display banks (random selection for users)
export const DISPLAY_BANKS = [
  "First Bank of Nigeria",
  "GTBank",
  "Access Bank",
  "UBA",
  "Zenith Bank",
  "Fidelity Bank",
  "Union Bank",
  "Ecobank",
  "Stanbic IBTC",
  "Polaris Bank",
  "Wema Bank",
  "Unity Bank",
  "Keystone Bank",
  "Heritage Bank",
  "Jaiz Bank",
  "Providus Bank",
  "Titan Trust Bank",
  "Globus Bank",
  "Premium Trust Bank",
  "Parallex Bank",
];

// Crypto wallet configurations
export const CRYPTO_CONFIGS = {
  BTC: {
    name: "Bitcoin",
    network: "Bitcoin Network",
    prefix: "bc1",
    confirmations: 3,
    minDeposit: 0.0001,
  },
  ETH: {
    name: "Ethereum",
    network: "ERC-20",
    prefix: "0x",
    confirmations: 12,
    minDeposit: 0.001,
  },
  SOL: {
    name: "Solana",
    network: "Solana Network",
    prefix: "",
    confirmations: 32,
    minDeposit: 0.01,
  },
  USDT: {
    name: "Tether",
    network: "TRC-20",
    prefix: "T",
    confirmations: 20,
    minDeposit: 1,
  },
  BNB: {
    name: "BNB",
    network: "BEP-20",
    prefix: "0x",
    confirmations: 15,
    minDeposit: 0.01,
  },
  ADA: {
    name: "Cardano",
    network: "Cardano Network",
    prefix: "addr1",
    confirmations: 10,
    minDeposit: 1,
  },
  DOT: {
    name: "Polkadot",
    network: "Polkadot Network",
    prefix: "1",
    confirmations: 20,
    minDeposit: 0.1,
  },
  XRP: {
    name: "XRP",
    network: "XRP Ledger",
    prefix: "r",
    confirmations: 1,
    minDeposit: 1,
  },
};

// ==================== DATABASE STORE ====================

class EnhancedDatabase {
  private users: Map<string, User> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private giftCards: Map<string, GiftCard> = new Map();
  private giftCardListings: Map<string, GiftCardListing> = new Map();
  private investments: Map<string, Investment> = new Map();
  private admins: Map<string, Admin> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private referralRewards: Map<string, ReferralReward> = new Map();
  private kycSubmissions: Map<string, KYCSubmission> = new Map();
  private currentUser: User | null = null;

  constructor() {
    this.initializeData();
  }

  // ==================== INITIALIZATION ====================

  private initializeData() {
    // Create admin
    const admin: Admin = {
      id: "admin-1",
      email: "admin@investglowing.com",
      name: "System Admin",
      role: "superadmin",
      permissions: ["all"],
    };
    this.admins.set(admin.id, admin);

    // Create demo user with full KYC
    const demoUser: User = {
      id: "user-1",
      email: "demo@investglowing.com",
      name: "Demo User",
      password: "Demo@123!",
      dateOfBirth: "1995-06-15",
      age: 30,
      isEmailVerified: true,
      kycStatus: "verified",
      kycLevel: 3,
      bvn: "12345678901",
      bvnVerified: true,
      nin: "12345678901",
      faceVerified: true,
      referralCode:
        "GLOW" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      referralCount: 5,
      referralEarnings: 250,
      balance: 25000,
      totalDeposited: 50000,
      totalWithdrawn: 25000,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      portfolio: {
        cash: 10000,
        crypto: { BTC: 0.15, ETH: 2.5, SOL: 50 },
        giftCards: ["gc-1", "gc-2"],
        investments: {},
      },
      bankAccounts: [
        {
          id: "bank-1",
          userId: "user-1",
          accountName: "Demo User",
          bankName: REAL_BANK_CONFIG.bankName,
          displayBankName: DISPLAY_BANKS[2], // Access Bank
          accountNumber: REAL_BANK_CONFIG.accountNumber,
          routingNumber: "000014",
          accountType: "savings",
          isVerified: true,
          isDefault: true,
          addedAt: new Date().toISOString(),
        },
      ],
      cryptoWallets: this.generateCryptoWallets("user-1"),
      isActive: true,
      isSuspended: false,
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo gift cards
    const giftCard1: GiftCard = {
      id: "gc-1",
      ownerId: "user-1",
      brand: "Amazon",
      code: "AMZN-XXXX-XXXX-1234",
      originalValue: 100,
      currentBalance: 75,
      isForSale: false,
      createdAt: new Date().toISOString(),
      transactions: [],
    };
    const giftCard2: GiftCard = {
      id: "gc-2",
      ownerId: "user-1",
      brand: "Starbucks",
      code: "SBUX-XXXX-XXXX-5678",
      originalValue: 50,
      currentBalance: 32,
      isForSale: false,
      createdAt: new Date().toISOString(),
      transactions: [],
    };
    this.giftCards.set(giftCard1.id, giftCard1);
    this.giftCards.set(giftCard2.id, giftCard2);

    // Create demo transactions
    const demoTransactions: Transaction[] = [
      {
        id: "tx-1",
        userId: "user-1",
        type: "deposit",
        amount: 5000,
        currency: "USD",
        status: "completed",
        from: "Access Bank ****2605",
        to: "Invest Glowing Wallet",
        fee: 0,
        description: "Initial deposit",
        metadata: {
          bankName: "Access Bank",
          accountNumber: "****2605",
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-2",
        userId: "user-1",
        type: "buy",
        amount: 10000,
        currency: "BTC",
        status: "completed",
        from: "USD Wallet",
        to: "BTC Wallet",
        fee: 50,
        description: "Purchased 0.15 BTC",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-3",
        userId: "user-1",
        type: "referral_bonus",
        amount: 50,
        currency: "USD",
        status: "completed",
        description: "Referral bonus - 5 referrals",
        metadata: {
          referralCode: demoUser.referralCode,
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    demoTransactions.forEach((tx) => this.transactions.set(tx.id, tx));

    // Create gift card listings
    const listings: GiftCardListing[] = [
      {
        id: "listing-1",
        sellerId: "user-2",
        sellerName: "CryptoTrader99",
        brand: "Amazon",
        value: 100,
        askingPrice: 85,
        discount: 15,
        listedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      },
      {
        id: "listing-2",
        sellerId: "user-3",
        sellerName: "GiftCardKing",
        brand: "Starbucks",
        value: 50,
        askingPrice: 40,
        discount: 20,
        listedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: "active",
      },
    ];
    listings.forEach((listing) =>
      this.giftCardListings.set(listing.id, listing),
    );
  }

  // ==================== CRYPTO WALLET GENERATION ====================

  private generateCryptoWallets(userId: string): CryptoWallet[] {
    const wallets: CryptoWallet[] = [];

    Object.entries(CRYPTO_CONFIGS).forEach(([symbol, config]) => {
      wallets.push({
        id: uuidv4(),
        userId,
        symbol,
        name: config.name,
        address: this.generateWalletAddress(symbol, config.prefix),
        network: config.network,
        balance: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      });
    });

    return wallets;
  }

  private generateWalletAddress(symbol: string, prefix: string): string {
    const random = uuidv4().replace(/-/g, "");

    switch (symbol) {
      case "BTC":
        return prefix + random.substring(0, 39);
      case "ETH":
      case "BNB":
        return prefix + random.substring(0, 40);
      case "SOL":
        return random.substring(0, 44);
      case "USDT":
        return prefix + random.substring(0, 33);
      case "ADA":
        return prefix + random.substring(0, 50);
      case "DOT":
        return "1" + random.substring(0, 47);
      case "XRP":
        return prefix + random.substring(0, 33);
      default:
        return prefix + random.substring(0, 40);
    }
  }

  // ==================== USER METHODS ====================

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  }

  getUserByReferralCode(code: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.referralCode === code);
  }

  createUser(
    email: string,
    name: string,
    password: string,
    dateOfBirth: string,
    referralCode?: string,
  ): { success: boolean; user?: User; error?: string } {
    // Check age
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return {
        success: false,
        error: "You must be at least 18 years old to use this platform",
      };
    }

    // Check if email exists
    if (this.getUserByEmail(email)) {
      return { success: false, error: "Email already registered" };
    }

    // Generate referral code
    const newReferralCode =
      "GLOW" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const user: User = {
      id: uuidv4(),
      email,
      name,
      password,
      dateOfBirth,
      age,
      isEmailVerified: false,
      emailVerificationToken: uuidv4(),
      emailVerificationExpires: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
      kycStatus: "not_started",
      kycLevel: 0,
      bvnVerified: false,
      faceVerified: false,
      referralCode: newReferralCode,
      referredBy: referralCode,
      referralCount: 0,
      referralEarnings: 0,
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      createdAt: new Date().toISOString(),
      portfolio: {
        cash: 0,
        crypto: {},
        giftCards: [],
        investments: {},
      },
      bankAccounts: [],
      cryptoWallets: this.generateCryptoWallets("temp"),
      isActive: true,
      isSuspended: false,
    };

    // Update crypto wallet userIds
    user.cryptoWallets = user.cryptoWallets.map((w) => ({
      ...w,
      userId: user.id,
    }));

    this.users.set(user.id, user);

    // Process referral if code provided
    if (referralCode) {
      const referrer = this.getUserByReferralCode(referralCode);
      if (referrer) {
        referrer.referralCount++;
        this.users.set(referrer.id, referrer);
      }
    }

    return { success: true, user };
  }

  verifyEmail(token: string): { success: boolean; error?: string } {
    const user = Array.from(this.users.values()).find(
      (u) => u.emailVerificationToken === token,
    );

    if (!user) {
      return { success: false, error: "Invalid verification token" };
    }

    if (
      user.emailVerificationExpires &&
      new Date(user.emailVerificationExpires) < new Date()
    ) {
      return { success: false, error: "Verification link has expired" };
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    this.users.set(user.id, user);

    return { success: true };
  }

  updateUser(user: User): void {
    this.users.set(user.id, user);
    if (this.currentUser?.id === user.id) {
      this.currentUser = user;
    }
  }

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // ==================== KYC METHODS ====================

  submitKYC(
    userId: string,
    idType: string,
    idNumber: string,
    idDocumentUrl: string,
    selfieUrl: string,
  ): KYCSubmission {
    const submission: KYCSubmission = {
      id: uuidv4(),
      userId,
      idType,
      idNumber,
      idDocumentUrl,
      selfieUrl,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    this.kycSubmissions.set(submission.id, submission);

    const user = this.users.get(userId);
    if (user) {
      user.kycStatus = "pending";
      if (idType === "bvn") {
        user.bvn = idNumber;
        user.kycLevel = 2;
      } else {
        user.kycLevel = 3;
      }
      this.users.set(userId, user);
    }

    return submission;
  }

  verifyBVN(userId: string, bvn: string): { success: boolean; error?: string } {
    // Simulate BVN verification
    if (bvn.length !== 11 || !/^\d+$/.test(bvn)) {
      return { success: false, error: "Invalid BVN format" };
    }

    const user = this.users.get(userId);
    if (user) {
      user.bvn = bvn;
      user.bvnVerified = true;
      user.kycLevel = Math.max(user.kycLevel, 2) as 0 | 1 | 2 | 3;
      if (user.kycStatus === "not_started") {
        user.kycStatus = "pending";
      }
      this.users.set(userId, user);
    }

    return { success: true };
  }

  // ==================== BANK ACCOUNT METHODS ====================

  addBankAccount(
    userId: string,
    account: Omit<BankAccount, "id" | "userId" | "addedAt" | "displayBankName">,
  ): BankAccount {
    // Get random display bank
    const displayBankName =
      DISPLAY_BANKS[Math.floor(Math.random() * DISPLAY_BANKS.length)];

    const bankAccount: BankAccount = {
      ...account,
      id: uuidv4(),
      userId,
      displayBankName,
      addedAt: new Date().toISOString(),
    };

    const user = this.users.get(userId);
    if (user) {
      // If first account, make it default
      if (user.bankAccounts.length === 0) {
        bankAccount.isDefault = true;
      }
      user.bankAccounts.push(bankAccount);
      this.users.set(userId, user);
    }

    return bankAccount;
  }

  // ==================== CRYPTO WALLET METHODS ====================

  getCryptoWallet(userId: string, symbol: string): CryptoWallet | undefined {
    const user = this.users.get(userId);
    return user?.cryptoWallets.find((w) => w.symbol === symbol);
  }

  // ==================== TRANSACTION METHODS ====================

  createTransaction(
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Transaction {
    const tx: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.set(tx.id, tx);

    // Create notification
    this.createNotification({
      userId: tx.userId,
      type: "transaction",
      title: `Transaction ${tx.status}`,
      message: `${tx.type} of $${tx.amount} ${tx.currency} is ${tx.status}`,
    });

    return tx;
  }

  getUserTransactions(userId: string): Transaction[] {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  getPendingTransactions(): Transaction[] {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.status === "pending")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  approveTransaction(
    txId: string,
    adminId: string,
    note?: string,
  ): Transaction | undefined {
    const tx = this.transactions.get(txId);
    if (!tx) return undefined;

    tx.status = "completed";
    tx.approvedBy = adminId;
    tx.approvedAt = new Date().toISOString();
    tx.adminNote = note;
    tx.updatedAt = new Date().toISOString();
    this.transactions.set(txId, tx);

    // Update user balance
    const user = this.users.get(tx.userId);
    if (user) {
      if (tx.type === "deposit") {
        user.balance += tx.amount;
        user.portfolio.cash += tx.amount;
        user.totalDeposited += tx.amount;

        // Check for referral reward
        if (user.referredBy && user.totalDeposited >= 100) {
          this.processReferralReward(user);
        }
      } else if (tx.type === "withdrawal") {
        user.balance -= tx.amount;
        user.portfolio.cash -= tx.amount;
        user.totalWithdrawn += tx.amount;
      }
      this.users.set(user.id, user);
    }

    this.createNotification({
      userId: tx.userId,
      type: "approval",
      title: "Transaction Approved",
      message: `Your ${tx.type} of $${tx.amount} has been approved`,
    });

    return tx;
  }

  rejectTransaction(
    txId: string,
    adminId: string,
    reason: string,
  ): Transaction | undefined {
    const tx = this.transactions.get(txId);
    if (!tx) return undefined;

    tx.status = "rejected";
    tx.approvedBy = adminId;
    tx.approvedAt = new Date().toISOString();
    tx.adminNote = reason;
    tx.updatedAt = new Date().toISOString();
    this.transactions.set(txId, tx);

    this.createNotification({
      userId: tx.userId,
      type: "approval",
      title: "Transaction Rejected",
      message: `Your ${tx.type} of $${tx.amount} was rejected: ${reason}`,
    });

    return tx;
  }

  // ==================== REFERRAL METHODS ====================

  private processReferralReward(referredUser: User): void {
    if (!referredUser.referredBy) return;

    const referrer = this.getUserByReferralCode(referredUser.referredBy);
    if (!referrer) return;

    // Check if reward already given
    const existingReward = Array.from(this.referralRewards.values()).find(
      (r) => r.referredId === referredUser.id && r.status === "paid",
    );
    if (existingReward) return;

    // Create reward
    const reward: ReferralReward = {
      id: uuidv4(),
      referrerId: referrer.id,
      referredId: referredUser.id,
      amount: 10, // $10 referral bonus
      status: "paid",
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };
    this.referralRewards.set(reward.id, reward);

    // Update referrer
    referrer.referralEarnings += reward.amount;
    referrer.balance += reward.amount;
    this.users.set(referrer.id, referrer);

    // Create referral bonus transaction
    this.createTransaction({
      userId: referrer.id,
      type: "referral_bonus",
      amount: reward.amount,
      currency: "USD",
      status: "completed",
      description: `Referral bonus for ${referredUser.name}`,
      metadata: {
        referralCode: referrer.referralCode,
      },
    });

    this.createNotification({
      userId: referrer.id,
      type: "referral",
      title: "Referral Bonus Received!",
      message: `You earned $${reward.amount} for referring ${referredUser.name}`,
    });
  }

  getReferralRewards(userId: string): ReferralReward[] {
    return Array.from(this.referralRewards.values())
      .filter((r) => r.referrerId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  // ==================== GIFT CARD METHODS ====================

  createGiftCard(
    userId: string,
    brand: string,
    code: string,
    value: number,
  ): GiftCard {
    const giftCard: GiftCard = {
      id: uuidv4(),
      ownerId: userId,
      brand,
      code,
      originalValue: value,
      currentBalance: value,
      isForSale: false,
      createdAt: new Date().toISOString(),
      transactions: [],
    };
    this.giftCards.set(giftCard.id, giftCard);

    const user = this.users.get(userId);
    if (user) {
      user.portfolio.giftCards.push(giftCard.id);
      this.users.set(userId, user);
    }

    return giftCard;
  }

  getUserGiftCards(userId: string): GiftCard[] {
    return Array.from(this.giftCards.values()).filter(
      (gc) => gc.ownerId === userId,
    );
  }

  // ==================== GIFT CARD MARKETPLACE ====================

  createGiftCardListing(
    listing: Omit<GiftCardListing, "id" | "listedAt">,
  ): GiftCardListing {
    const newListing: GiftCardListing = {
      ...listing,
      id: uuidv4(),
      listedAt: new Date().toISOString(),
    };
    this.giftCardListings.set(newListing.id, newListing);
    return newListing;
  }

  getActiveListings(): GiftCardListing[] {
    return Array.from(this.giftCardListings.values())
      .filter((l) => l.status === "active")
      .sort(
        (a, b) =>
          new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime(),
      );
  }

  buyGiftCard(
    listingId: string,
    buyerId: string,
  ): { success: boolean; message: string } {
    const listing = this.giftCardListings.get(listingId);
    if (!listing) return { success: false, message: "Listing not found" };
    if (listing.status !== "active")
      return { success: false, message: "Listing not active" };

    const buyer = this.users.get(buyerId);
    if (!buyer) return { success: false, message: "Buyer not found" };
    if (buyer.balance < listing.askingPrice)
      return { success: false, message: "Insufficient balance" };

    // Transfer funds
    buyer.balance -= listing.askingPrice;
    this.users.set(buyerId, buyer);

    const seller = this.users.get(listing.sellerId);
    if (seller) {
      seller.balance += listing.askingPrice;
      this.users.set(listing.sellerId, seller);
    }

    // Update listing
    listing.status = "sold";
    this.giftCardListings.set(listingId, listing);

    // Create transaction records
    this.createTransaction({
      userId: buyerId,
      type: "giftcard_send",
      amount: listing.askingPrice,
      currency: "USD",
      status: "completed",
      description: `Bought ${listing.brand} gift card worth $${listing.value}`,
    });

    return { success: true, message: "Gift card purchased successfully" };
  }

  // ==================== INVESTMENT METHODS ====================

  createInvestment(
    userId: string,
    name: string,
    category: string,
    amount: number,
    apy: number,
  ): Investment | null {
    if (amount < 15) return null;

    const user = this.users.get(userId);
    if (!user || user.balance < amount) return null;

    user.balance -= amount;
    this.users.set(userId, user);

    const investment: Investment = {
      id: uuidv4(),
      userId,
      name,
      category,
      amount,
      apy,
      startDate: new Date().toISOString(),
      status: "active",
      returns: 0,
    };
    this.investments.set(investment.id, investment);

    this.createTransaction({
      userId,
      type: "investment",
      amount,
      currency: "USD",
      status: "completed",
      description: `Invested in ${name}`,
    });

    return investment;
  }

  getUserInvestments(userId: string): Investment[] {
    return Array.from(this.investments.values())
      .filter((inv) => inv.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
  }

  // ==================== ADMIN METHODS ====================

  getAdmin(id: string): Admin | undefined {
    return this.admins.get(id);
  }

  getAdminByEmail(email: string): Admin | undefined {
    return Array.from(this.admins.values()).find((a) => a.email === email);
  }

  // ==================== NOTIFICATION METHODS ====================

  createNotification(
    notification: Omit<Notification, "id" | "createdAt" | "isRead">,
  ): Notification {
    const notif: Notification = {
      ...notification,
      id: uuidv4(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(notif.id, notif);
    return notif;
  }

  getUserNotifications(userId: string): Notification[] {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  markNotificationRead(notifId: string): void {
    const notif = this.notifications.get(notifId);
    if (notif) {
      notif.isRead = true;
      this.notifications.set(notifId, notif);
    }
  }

  // ==================== STATS ====================

  getStats() {
    return {
      totalUsers: this.users.size,
      totalTransactions: this.transactions.size,
      pendingTransactions: this.getPendingTransactions().length,
      totalVolume: Array.from(this.transactions.values())
        .filter((tx) => tx.status === "completed" || tx.status === "approved")
        .reduce((sum, tx) => sum + tx.amount, 0),
      activeGiftCardListings: this.getActiveListings().length,
      totalInvestments: this.investments.size,
      totalReferralRewards: Array.from(this.referralRewards.values())
        .filter((r) => r.status === "paid")
        .reduce((sum, r) => sum + r.amount, 0),
    };
  }

  // ==================== PASSWORD VALIDATION ====================

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return { valid: errors.length === 0, errors };
  }
}

// Export singleton instance
export const enhancedDb = new EnhancedDatabase();

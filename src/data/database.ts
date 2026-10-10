// Invest Glowing - Real Database Store
// Handles all real transactions, bank accounts, wallets, and trading

import { v4 as uuidv4 } from 'uuid';

// ==================== TYPES ====================

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  balance: number;
  isVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  portfolio: {
    cash: number;
    crypto: { [symbol: string]: number };
    giftCards: string[];
    investments: { [id: string]: number };
  };
  bankAccounts: BankAccount[];
  cryptoWallets: CryptoWallet[];
}

export interface BankAccount {
  id: string;
  userId: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  isVerified: boolean;
  addedAt: string;
}

export interface CryptoWallet {
  id: string;
  userId: string;
  symbol: string;
  address: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'transfer' | 'giftcard_redeem' | 'giftcard_send' | 'investment' | 'earning';
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  from?: string;
  to?: string;
  fee?: number;
  description?: string;
  adminNote?: string;
  approvedBy?: string;
  approvedAt?: string;
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
  type: 'purchase' | 'sale' | 'redeem' | 'transfer';
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
  status: 'active' | 'sold' | 'cancelled';
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
  status: 'active' | 'matured' | 'withdrawn';
  returns: number;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'moderator';
  permissions: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'transaction' | 'approval' | 'market' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ==================== DATABASE STORE ====================

class Database {
  private users: Map<string, User> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private giftCards: Map<string, GiftCard> = new Map();
  private giftCardListings: Map<string, GiftCardListing> = new Map();
  private investments: Map<string, Investment> = new Map();
  private admins: Map<string, Admin> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private currentUser: User | null = null;

  constructor() {
    this.initializeDemoData();
  }

  // ==================== INITIALIZATION ====================

  private initializeDemoData() {
    // Create demo admin
    const admin: Admin = {
      id: 'admin-1',
      email: 'admin@investglowing.com',
      name: 'System Admin',
      role: 'superadmin',
      permissions: ['all'],
    };
    this.admins.set(admin.id, admin);

    // Create demo user
    const demoUser: User = {
      id: 'user-1',
      email: 'demo@investglowing.com',
      name: 'Demo User',
      password: 'demo123',
      balance: 25000,
      isVerified: true,
      kycStatus: 'verified',
      createdAt: new Date().toISOString(),
      portfolio: {
        cash: 10000,
        crypto: { BTC: 0.15, ETH: 2.5, SOL: 50 },
        giftCards: ['gc-1', 'gc-2'],
        investments: {},
      },
      bankAccounts: [
        {
          id: 'bank-1',
          userId: 'user-1',
          accountName: 'Primary Checking',
          bankName: 'Chase Bank',
          accountNumber: '****1234',
          routingNumber: '021000021',
          accountType: 'checking',
          isVerified: true,
          addedAt: new Date().toISOString(),
        },
      ],
      cryptoWallets: [
        {
          id: 'wallet-1',
          userId: 'user-1',
          symbol: 'BTC',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          balance: 0.15,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'wallet-2',
          userId: 'user-1',
          symbol: 'ETH',
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          balance: 2.5,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo gift cards
    const giftCard1: GiftCard = {
      id: 'gc-1',
      ownerId: 'user-1',
      brand: 'Amazon',
      code: 'AMZN-XXXX-XXXX-1234',
      originalValue: 100,
      currentBalance: 75,
      isForSale: false,
      createdAt: new Date().toISOString(),
      transactions: [],
    };
    const giftCard2: GiftCard = {
      id: 'gc-2',
      ownerId: 'user-1',
      brand: 'Starbucks',
      code: 'SBUX-XXXX-XXXX-5678',
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
        id: 'tx-1',
        userId: 'user-1',
        type: 'deposit',
        amount: 5000,
        currency: 'USD',
        status: 'completed',
        from: 'Chase Bank ****1234',
        to: 'Invest Glowing Wallet',
        fee: 0,
        description: 'Initial deposit',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'tx-2',
        userId: 'user-1',
        type: 'buy',
        amount: 10000,
        currency: 'BTC',
        status: 'completed',
        from: 'USD Wallet',
        to: 'BTC Wallet',
        fee: 50,
        description: 'Purchased 0.15 BTC',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'tx-3',
        userId: 'user-1',
        type: 'deposit',
        amount: 15000,
        currency: 'USD',
        status: 'approved',
        from: 'Chase Bank ****1234',
        to: 'Invest Glowing Wallet',
        fee: 0,
        description: 'Bank transfer',
        approvedBy: 'admin-1',
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    demoTransactions.forEach(tx => this.transactions.set(tx.id, tx));

    // Create gift card listings
    const listings: GiftCardListing[] = [
      {
        id: 'listing-1',
        sellerId: 'user-2',
        sellerName: 'CryptoTrader99',
        brand: 'Amazon',
        value: 100,
        askingPrice: 85,
        discount: 15,
        listedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        id: 'listing-2',
        sellerId: 'user-3',
        sellerName: 'GiftCardKing',
        brand: 'Starbucks',
        value: 50,
        askingPrice: 40,
        discount: 20,
        listedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        id: 'listing-3',
        sellerId: 'user-4',
        sellerName: 'DeFiMaster',
        brand: 'Airbnb',
        value: 200,
        askingPrice: 170,
        discount: 15,
        listedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
    ];
    listings.forEach(listing => this.giftCardListings.set(listing.id, listing));
  }

  // ==================== USER METHODS ====================

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  createUser(email: string, name: string, password: string): User {
    const user: User = {
      id: uuidv4(),
      email,
      name,
      password,
      balance: 0,
      isVerified: false,
      kycStatus: 'pending',
      createdAt: new Date().toISOString(),
      portfolio: {
        cash: 0,
        crypto: {},
        giftCards: [],
        investments: {},
      },
      bankAccounts: [],
      cryptoWallets: [],
    };
    this.users.set(user.id, user);
    return user;
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

  // ==================== BANK ACCOUNT METHODS ====================

  addBankAccount(userId: string, account: Omit<BankAccount, 'id' | 'userId' | 'addedAt'>): BankAccount {
    const bankAccount: BankAccount = {
      ...account,
      id: uuidv4(),
      userId,
      addedAt: new Date().toISOString(),
    };
    const user = this.users.get(userId);
    if (user) {
      user.bankAccounts.push(bankAccount);
      this.users.set(userId, user);
    }
    return bankAccount;
  }

  // ==================== CRYPTO WALLET METHODS ====================

  createCryptoWallet(userId: string, symbol: string): CryptoWallet {
    const wallet: CryptoWallet = {
      id: uuidv4(),
      userId,
      symbol,
      address: this.generateWalletAddress(symbol),
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    const user = this.users.get(userId);
    if (user) {
      user.cryptoWallets.push(wallet);
      this.users.set(userId, user);
    }
    return wallet;
  }

  private generateWalletAddress(symbol: string): string {
    const prefixes: { [key: string]: string } = {
      BTC: 'bc1',
      ETH: '0x',
      SOL: '',
      ADA: 'addr1',
    };
    const prefix = prefixes[symbol] || '0x';
    const random = uuidv4().replace(/-/g, '').substring(0, 36);
    return prefix + random;
  }

  // ==================== TRANSACTION METHODS ====================

  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const tx: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.set(tx.id, tx);
    
    // Create notification for user
    this.createNotification({
      userId: tx.userId,
      type: 'transaction',
      title: `Transaction ${tx.status}`,
      message: `${tx.type} of ${tx.amount} ${tx.currency} is ${tx.status}`,
    });

    return tx;
  }

  getUserTransactions(userId: string): Transaction[] {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getPendingTransactions(): Transaction[] {
    return Array.from(this.transactions.values())
      .filter(tx => tx.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  approveTransaction(txId: string, adminId: string, note?: string): Transaction | undefined {
    const tx = this.transactions.get(txId);
    if (!tx) return undefined;

    tx.status = 'approved';
    tx.approvedBy = adminId;
    tx.approvedAt = new Date().toISOString();
    tx.adminNote = note;
    tx.updatedAt = new Date().toISOString();
    this.transactions.set(txId, tx);

    // Update user balance if deposit
    if (tx.type === 'deposit') {
      const user = this.users.get(tx.userId);
      if (user) {
        user.balance += tx.amount;
        user.portfolio.cash += tx.amount;
        this.users.set(user.id, user);
      }
    }

    // Create notification
    this.createNotification({
      userId: tx.userId,
      type: 'approval',
      title: 'Transaction Approved',
      message: `Your ${tx.type} of $${tx.amount} has been approved`,
    });

    return tx;
  }

  rejectTransaction(txId: string, adminId: string, reason: string): Transaction | undefined {
    const tx = this.transactions.get(txId);
    if (!tx) return undefined;

    tx.status = 'rejected';
    tx.approvedBy = adminId;
    tx.approvedAt = new Date().toISOString();
    tx.adminNote = reason;
    tx.updatedAt = new Date().toISOString();
    this.transactions.set(txId, tx);

    // Create notification
    this.createNotification({
      userId: tx.userId,
      type: 'approval',
      title: 'Transaction Rejected',
      message: `Your ${tx.type} of $${tx.amount} was rejected: ${reason}`,
    });

    return tx;
  }

  // ==================== GIFT CARD METHODS ====================

  createGiftCard(userId: string, brand: string, code: string, value: number): GiftCard {
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
    return Array.from(this.giftCards.values())
      .filter(gc => gc.ownerId === userId);
  }

  // ==================== GIFT CARD MARKETPLACE ====================

  createGiftCardListing(listing: Omit<GiftCardListing, 'id' | 'listedAt'>): GiftCardListing {
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
      .filter(l => l.status === 'active')
      .sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
  }

  buyGiftCard(listingId: string, buyerId: string): { success: boolean; message: string } {
    const listing = this.giftCardListings.get(listingId);
    if (!listing) return { success: false, message: 'Listing not found' };
    if (listing.status !== 'active') return { success: false, message: 'Listing not active' };

    const buyer = this.users.get(buyerId);
    if (!buyer) return { success: false, message: 'Buyer not found' };
    if (buyer.balance < listing.askingPrice) return { success: false, message: 'Insufficient balance' };

    // Transfer funds
    buyer.balance -= listing.askingPrice;
    this.users.set(buyerId, buyer);

    const seller = this.users.get(listing.sellerId);
    if (seller) {
      seller.balance += listing.askingPrice;
      this.users.set(listing.sellerId, seller);
    }

    // Update listing
    listing.status = 'sold';
    this.giftCardListings.set(listingId, listing);

    // Create transaction records
    this.createTransaction({
      userId: buyerId,
      type: 'giftcard_send',
      amount: listing.askingPrice,
      currency: 'USD',
      status: 'completed',
      description: `Bought ${listing.brand} gift card worth $${listing.value}`,
    });

    return { success: true, message: 'Gift card purchased successfully' };
  }

  // ==================== INVESTMENT METHODS ====================

  createInvestment(userId: string, name: string, category: string, amount: number, apy: number): Investment | null {
    if (amount < 15) return null; // Minimum $15 investment

    const user = this.users.get(userId);
    if (!user || user.balance < amount) return null;

    // Deduct from balance
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
      status: 'active',
      returns: 0,
    };
    this.investments.set(investment.id, investment);

    // Create transaction
    this.createTransaction({
      userId,
      type: 'investment',
      amount,
      currency: 'USD',
      status: 'completed',
      description: `Invested in ${name}`,
    });

    return investment;
  }

  getUserInvestments(userId: string): Investment[] {
    return Array.from(this.investments.values())
      .filter(inv => inv.userId === userId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  // ==================== ADMIN METHODS ====================

  getAdmin(id: string): Admin | undefined {
    return this.admins.get(id);
  }

  getAdminByEmail(email: string): Admin | undefined {
    return Array.from(this.admins.values()).find(a => a.email === email);
  }

  // ==================== NOTIFICATION METHODS ====================

  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
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
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
        .filter(tx => tx.status === 'completed' || tx.status === 'approved')
        .reduce((sum, tx) => sum + tx.amount, 0),
      activeGiftCardListings: this.getActiveListings().length,
      totalInvestments: this.investments.size,
    };
  }
}

// Export singleton instance
export const db = new Database();

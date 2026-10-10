import { useState } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { 
  Shield, 
  Users, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock,
  LogOut,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { Transaction } from '@/data/enhancedDatabase';

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const { 
    admin, 
    adminLogin, 
    logout, 
    pendingTransactions, 
    approveTransaction, 
    rejectTransaction,
    refreshTransactions,
    stats 
  } = useAuth();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'users'>('overview');

  const handleLogin = async () => {
    setIsLoading(true);
    const success = await adminLogin(email, password);
    if (success) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  };

  const handleApprove = async (txId: string) => {
    await approveTransaction(txId);
    setSelectedTransaction(null);
  };

  const handleReject = async () => {
    if (!selectedTransaction || !rejectionReason) return;
    await rejectTransaction(selectedTransaction.id, rejectionReason);
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedTransaction(null);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    onClose();
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="glass-card max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-led-purple/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-led-purple" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground">Admin Login</h2>
            <p className="text-muted-foreground mt-2">Enter your credentials to access the admin dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@investglowing.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Demo: admin@investglowing.com / Admin@123!
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 btn-primary"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-12"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-lab-white overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-led-purple flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-semibold text-lg">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">{admin?.name} • {admin?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshTransactions}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            {(['overview', 'transactions', 'users'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-led-purple/10 text-led-purple'
                    : 'text-muted-foreground hover:text-foreground hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-led-purple/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-led-purple" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total Users</span>
                </div>
                <p className="font-mono text-3xl font-bold text-foreground">{stats.totalUsers}</p>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-led-green/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-led-green" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total Volume</span>
                </div>
                <p className="font-mono text-3xl font-bold text-foreground">
                  ${(stats.totalVolume / 1e6).toFixed(2)}M
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <p className="font-mono text-3xl font-bold text-foreground">{stats.pendingTransactions}</p>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Investments</span>
                </div>
                <p className="font-mono text-3xl font-bold text-foreground">{stats.totalInvestments}</p>
              </div>
            </div>

            {/* Recent Pending Transactions */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-lg">Pending Transactions</h3>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm text-led-purple hover:underline"
                >
                  View all
                </button>
              </div>
              
              {pendingTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-led-green mx-auto mb-3" />
                  <p className="text-muted-foreground">No pending transactions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTransactions.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-led-green/10' : 'bg-red-500/10'
                        }`}>
                          {tx.type === 'deposit' ? (
                            <DollarSign className="w-5 h-5 text-led-green" />
                          ) : (
                            <CreditCard className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground capitalize">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold text-foreground">
                          ${tx.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg">All Transactions</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-10 rounded-xl w-64" />
                </div>
                <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {pendingTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-led-green/10' : 'bg-red-500/10'
                    }`}>
                      {tx.type === 'deposit' ? (
                        <DollarSign className="w-5 h-5 text-led-green" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-mono font-semibold text-foreground">
                        ${tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(tx.id)}
                        className="p-2 rounded-xl bg-led-green/10 text-led-green hover:bg-led-green/20 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTransaction(tx);
                          setShowRejectModal(true);
                        }}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-6">User Management</h3>
            <p className="text-muted-foreground">User management features coming soon...</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">Reject Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Reason for rejection</Label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full h-32 p-4 rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-led-purple/30"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleReject}
                disabled={!rejectionReason}
                className="flex-1 bg-red-500 hover:bg-red-500/90 text-white"
              >
                Reject
              </Button>
              <Button
                onClick={() => setShowRejectModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

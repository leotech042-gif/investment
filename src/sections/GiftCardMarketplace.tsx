import { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  Search, 
  ShoppingBag, 
  Gift, 
  Tag, 
  Percent, 
  User, 
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GiftCardListing {
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

const BRANDS = ['Amazon', 'Starbucks', 'Spotify', 'Airbnb', 'Netflix', 'Apple', 'Google Play', 'Xbox'];

// Mock listings
const mockListings: GiftCardListing[] = [
  { id: '1', sellerId: 'user-2', sellerName: 'CryptoTrader99', brand: 'Amazon', value: 100, askingPrice: 85, discount: 15, listedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'active' },
  { id: '2', sellerId: 'user-3', sellerName: 'GiftCardKing', brand: 'Starbucks', value: 50, askingPrice: 40, discount: 20, listedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), status: 'active' },
  { id: '3', sellerId: 'user-4', sellerName: 'DeFiMaster', brand: 'Airbnb', value: 200, askingPrice: 170, discount: 15, listedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), status: 'active' },
  { id: '4', sellerId: 'user-5', sellerName: 'CryptoQueen', brand: 'Spotify', value: 60, askingPrice: 50, discount: 17, listedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), status: 'active' },
  { id: '5', sellerId: 'user-6', sellerName: 'BitcoinBaron', brand: 'Netflix', value: 120, askingPrice: 100, discount: 17, listedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: 'active' },
  { id: '6', sellerId: 'user-7', sellerName: 'EthereumEmpress', brand: 'Apple', value: 150, askingPrice: 130, discount: 13, listedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), status: 'active' },
];

export function GiftCardMarketplace() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [listings, setListings] = useState<GiftCardListing[]>(mockListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<GiftCardListing | null>(null);
  
  // List form states
  const [listBrand, setListBrand] = useState('');
  const [listValue, setListValue] = useState('');
  const [listPrice, setListPrice] = useState('');
  
  const { isAuthenticated, createGiftCardListing, buyGiftCard } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand ? listing.brand === selectedBrand : true;
    return matchesSearch && matchesBrand && listing.status === 'active';
  });

  const handleListCard = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to list gift cards');
      return;
    }
    
    const value = parseFloat(listValue);
    const price = parseFloat(listPrice);
    
    if (!listBrand || !value || !price) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (price >= value) {
      toast.error('Asking price must be less than card value');
      return;
    }

    const result = await createGiftCardListing(listBrand, value, price);
    if (result) {
      setListings([result, ...listings]);
      setShowListModal(false);
      setListBrand('');
      setListValue('');
      setListPrice('');
    }
  };

  const handleBuy = async () => {
    if (!selectedListing) return;
    
    const result = await buyGiftCard(selectedListing.id);
    if (result.success) {
      setListings(listings.map(l => 
        l.id === selectedListing.id ? { ...l, status: 'sold' } : l
      ));
      setShowBuyModal(false);
      setSelectedListing(null);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="giftcard-marketplace"
      className="relative py-24 bg-lab-white overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-led-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-led-green/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`flex flex-wrap items-end justify-between gap-6 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-led-purple/10 mb-4">
              <Store className="w-4 h-4 text-led-purple" />
              <span className="font-mono text-xs uppercase tracking-wider text-led-purple">
                Marketplace
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
              Gift Card Trading
            </h2>
            <p className="text-muted-foreground mt-2">
              Buy and sell gift cards at discounted prices
            </p>
          </div>

          <Button
            onClick={() => setShowListModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            List Your Card
          </Button>
        </div>

        {/* Filters */}
        <div
          className={`flex flex-wrap gap-4 mb-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search brands or sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>

          {/* Brand Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedBrand(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedBrand === null
                  ? 'bg-led-purple text-white'
                  : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
              }`}
            >
              All Brands
            </button>
            {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedBrand === brand
                    ? 'bg-led-purple text-white'
                    : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {filteredListings.map((listing, index) => (
            <div
              key={listing.id}
              className="glass-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => {
                setSelectedListing(listing);
                setShowBuyModal(true);
              }}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Card Visual */}
              <div className={`relative h-32 rounded-2xl mb-4 overflow-hidden ${
                listing.brand === 'Amazon' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                listing.brand === 'Starbucks' ? 'bg-green-700' :
                listing.brand === 'Spotify' ? 'bg-green-500' :
                listing.brand === 'Airbnb' ? 'bg-rose-500' :
                listing.brand === 'Netflix' ? 'bg-red-600' :
                listing.brand === 'Apple' ? 'bg-gray-800' :
                listing.brand === 'Google Play' ? 'bg-blue-500' :
                'bg-led-purple'
              }`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-4 left-4">
                  <p className="text-white/80 text-sm">Gift Card</p>
                  <p className="text-white font-bold text-xl">{listing.brand}</p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <p className="text-white/80 text-sm">Value</p>
                  <p className="text-white font-bold text-2xl">${listing.value}</p>
                </div>
                <Gift className="absolute top-4 right-4 w-8 h-8 text-white/30" />
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{listing.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-led-green/10">
                    <Percent className="w-3 h-3 text-led-green" />
                    <span className="text-xs font-medium text-led-green">{listing.discount}% OFF</span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Asking Price</p>
                    <p className="font-mono text-2xl font-bold text-foreground">${listing.askingPrice}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedListing(listing);
                      setShowBuyModal(true);
                    }}
                    className="btn-primary"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No gift cards found matching your criteria</p>
          </div>
        )}
      </div>

      {/* List Card Modal */}
      <Dialog open={showListModal} onOpenChange={setShowListModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-led-purple/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-led-purple" />
              </div>
              List Your Gift Card
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <Label>Brand</Label>
              <select
                value={listBrand}
                onChange={(e) => setListBrand(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-led-purple/30"
              >
                <option value="">Select brand...</option>
                {BRANDS.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Card Value ($)</Label>
              <Input
                type="number"
                placeholder="100"
                value={listValue}
                onChange={(e) => setListValue(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label>Asking Price ($)</Label>
              <Input
                type="number"
                placeholder="85"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                className="h-12 rounded-xl"
              />
              {listValue && listPrice && (
                <p className="text-sm text-muted-foreground mt-2">
                  Discount: {Math.round(((parseFloat(listValue) - parseFloat(listPrice)) / parseFloat(listValue)) * 100)}%
                </p>
              )}
            </div>
            <Button onClick={handleListCard} className="w-full btn-primary h-12">
              List for Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buy Modal */}
      <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              Buy Gift Card
            </DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-6 mt-4">
              {/* Card Preview */}
              <div className={`h-40 rounded-2xl overflow-hidden ${
                selectedListing.brand === 'Amazon' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                selectedListing.brand === 'Starbucks' ? 'bg-green-700' :
                selectedListing.brand === 'Spotify' ? 'bg-green-500' :
                selectedListing.brand === 'Airbnb' ? 'bg-rose-500' :
                selectedListing.brand === 'Netflix' ? 'bg-red-600' :
                selectedListing.brand === 'Apple' ? 'bg-gray-800' :
                selectedListing.brand === 'Google Play' ? 'bg-blue-500' :
                'bg-led-purple'
              }`}>
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Gift Card</p>
                    <p className="text-white font-bold text-2xl">{selectedListing.brand}</p>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Value</p>
                    <p className="text-white font-bold text-3xl">${selectedListing.value}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 p-4 rounded-2xl bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Seller</span>
                  <span className="font-medium">{selectedListing.sellerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Original Value</span>
                  <span className="font-mono">${selectedListing.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-mono text-led-green">{selectedListing.discount}%</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="font-medium">You Pay</span>
                  <span className="font-mono text-2xl font-bold text-led-purple">${selectedListing.askingPrice}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleBuy} className="flex-1 btn-primary h-12">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Purchase
                </Button>
                <Button
                  onClick={() => setShowBuyModal(false)}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

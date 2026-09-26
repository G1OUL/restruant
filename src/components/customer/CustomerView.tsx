import React, { useState, useMemo } from 'react';
import { ShoppingBag, Sparkles, AlertCircle, ArrowRight, Camera, QrCode } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MainCategory, DietType, MenuItem } from '../../types';
import { WelcomeBanner } from './WelcomeBanner';
import { MenuCategoryNav } from './MenuCategoryNav';
import { MenuItemCard } from './MenuItemCard';

interface CustomerViewProps {
  onOpenCart: () => void;
  onOpenOrderTracker: () => void;
  onOpenTableModal: () => void;
  onOpenQRScanner: () => void;
  onOpenTableQRModal: () => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  onOpenCart,
  onOpenOrderTracker,
  onOpenTableModal,
  onOpenQRScanner,
  onOpenTableQRModal,
}) => {
  const { menu, cartCount, cartTotal, latestCurrentTableOrder, tableNumber } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory>('All');
  const [selectedDiet, setSelectedDiet] = useState<DietType | 'all'>('all');
  const [spicyOnly, setSpicyOnly] = useState(false);

  // Compute counts per main category
  const categoryCounts = useMemo(() => {
    const counts: Record<MainCategory, number> = {
      All: menu.length,
      Soups: menu.filter((m) => m.category.includes('Soups')).length,
      Starters: menu.filter((m) => m.category.includes('Starters')).length,
      Rice: menu.filter((m) => m.category.includes('Rice')).length,
      Noodles: menu.filter((m) => m.category.includes('Noodles')).length,
    };
    return counts;
  }, [menu]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      // Main Category match
      if (selectedMainCategory !== 'All') {
        if (!item.category.includes(selectedMainCategory)) {
          return false;
        }
      }

      // Diet match
      if (selectedDiet !== 'all') {
        if (item.diet !== selectedDiet) {
          return false;
        }
      }

      // Spicy filter
      if (spicyOnly && !item.isSpicy) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [menu, selectedMainCategory, selectedDiet, spicyOnly, searchQuery]);

  // Group by category if viewing 'All' and no search
  const isViewingAll = selectedMainCategory === 'All' && !searchQuery.trim();

  const groupedCategories = useMemo(() => {
    if (!isViewingAll) return null;
    const cats: { title: string; items: MenuItem[] }[] = [];
    const mainList: MainCategory[] = ['Soups', 'Starters', 'Rice', 'Noodles'];

    mainList.forEach((mainCat) => {
      const items = filteredItems.filter((i) => i.category.includes(mainCat));
      if (items.length > 0) {
        cats.push({ title: `${mainCat} Specialties`, items });
      }
    });

    return cats;
  }, [filteredItems, isViewingAll]);

  const hasActiveOrder =
    latestCurrentTableOrder &&
    latestCurrentTableOrder.status !== 'completed' &&
    latestCurrentTableOrder.status !== 'cancelled';

  return (
    <div className="pb-24 sm:pb-16 space-y-6">
      {/* Welcome & Table Service Hero */}
      <WelcomeBanner
        onOpenOrderTracker={onOpenOrderTracker}
        onOpenTableModal={onOpenTableModal}
        onOpenQRScanner={onOpenQRScanner}
        onOpenTableQRModal={onOpenTableQRModal}
      />

      {/* Filter and Search Navigation Bar */}
      <MenuCategoryNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMainCategory={selectedMainCategory}
        onSelectMainCategory={setSelectedMainCategory}
        selectedDiet={selectedDiet}
        onSelectDiet={setSelectedDiet}
        spicyOnly={spicyOnly}
        onToggleSpicyOnly={() => setSpicyOnly(!spicyOnly)}
        categoryCounts={categoryCounts}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
        <span>
          Showing <strong className="text-neutral-900 dark:text-neutral-100">{filteredItems.length}</strong> delicious dishes
        </span>
        {(searchQuery || selectedMainCategory !== 'All' || selectedDiet !== 'all' || spicyOnly) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMainCategory('All');
              setSelectedDiet('all');
              setSpicyOnly(false);
            }}
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
            No Chinese dishes matched your filters
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, or clear the dietary and spice filters to view our full menu.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMainCategory('All');
              setSelectedDiet('all');
              setSpicyOnly(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow-xs"
          >
            Show Full Menu
          </button>
        </div>
      ) : groupedCategories ? (
        <div className="space-y-8">
          {groupedCategories.map((group) => (
            <section key={group.title} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-50">
                  {group.title}
                </h2>
                <span className="text-xs text-neutral-400">({group.items.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((dish) => (
                  <MenuItemCard key={dish.id} item={dish} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((dish) => (
            <MenuItemCard key={dish.id} item={dish} />
          ))}
        </div>
      )}

      {/* Floating Sticky Mobile Ordering & Scanner Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-3 sm:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 shadow-2xl">
        <button
          onClick={onOpenQRScanner}
          className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0"
          title="Scan Table QR Code"
        >
          <Camera className="w-5 h-5 text-amber-500" />
        </button>

        {hasActiveOrder ? (
          <button
            onClick={onOpenOrderTracker}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg"
          >
            <span>Live Order #{latestCurrentTableOrder.orderNumber}</span>
            <div className="flex items-center gap-1 font-black">
              <span>{latestCurrentTableOrder.status.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ) : cartCount > 0 ? (
          <button
            onClick={onOpenCart}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-between shadow-lg active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[10px]">
                {cartCount}
              </span>
              <span>View Cart & Order</span>
            </div>
            <span className="tabular-nums font-extrabold text-sm">₹{cartTotal}</span>
          </button>
        ) : (
          <button
            onClick={onOpenTableQRModal}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-700"
          >
            <QrCode className="w-4 h-4 text-amber-500" />
            <span>Table Stand: {tableNumber.replace(/ \(.*\)/, '')}</span>
          </button>
        )}
      </div>
    </div>
  );
};

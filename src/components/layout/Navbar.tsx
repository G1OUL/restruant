import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  ShoppingBag, 
  Bell, 
  Receipt, 
  QrCode, 
  UtensilsCrossed, 
  ChefHat, 
  UserCheck,
  Camera,
  Printer
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenTableModal: () => void;
  onOpenOrderTracker: () => void;
  onOpenQRScanner: () => void;
  onOpenTableQRModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenTableModal,
  onOpenOrderTracker,
  onOpenQRScanner,
  onOpenTableQRModal,
}) => {
  const {
    isDarkMode,
    toggleTheme,
    tableNumber,
    currentRole,
    setCurrentRole,
    cartCount,
    serviceAlerts,
    orders,
    currentTableOrders,
    sendServiceAlert,
    currentTableActiveAlert,
  } = useRestaurant();

  const [callFeedback, setCallFeedback] = useState<string | null>(null);

  // Unresolved alerts for waiter
  const pendingAlertsCount = serviceAlerts.filter((a) => !a.isResolved).length;
  // Pending orders for kitchen
  const pendingKitchenOrders = orders.filter(
    (o) => o.status === 'received' || o.status === 'preparing'
  ).length;

  const handleCallWaiter = () => {
    sendServiceAlert('call_waiter', 'Customer requested assistance at table');
    setCallFeedback('Waiter has been notified!');
    setTimeout(() => setCallFeedback(null), 3500);
  };

  const handleRequestBill = () => {
    sendServiceAlert('request_bill', 'Customer requested final bill');
    setCallFeedback('Bill request sent to counter!');
    setTimeout(() => setCallFeedback(null), 3500);
  };

  const activeTableOrder = currentTableOrders.find(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Toast Alert Feedback Bar */}
      {callFeedback && (
        <div className="bg-amber-500 text-neutral-950 px-4 py-1.5 text-center text-xs font-semibold animate-pulse flex items-center justify-center gap-2">
          <Bell className="w-3.5 h-3.5" />
          <span>{callFeedback} Staff will be at your table momentarily.</span>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 shadow-sm font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 dark:text-neutral-50">
                Uncle's Chinese
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium hidden xs:inline">
                अंकल्स
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 tracking-wide font-medium">
              India's Chinese · Veg & Non-Veg
            </p>
          </div>
        </div>

        {/* Center Zone: Role Switcher Tabs */}
        <nav className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          <button
            onClick={() => setCurrentRole('customer')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              currentRole === 'customer'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span>Customer</span>
          </button>

          <button
            onClick={() => setCurrentRole('waiter')}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              currentRole === 'waiter'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Waiter</span>
            {pendingAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                {pendingAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentRole('kitchen')}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              currentRole === 'kitchen'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kitchen</span>
            {pendingKitchenOrders > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-neutral-950 font-mono">
                {pendingKitchenOrders}
              </span>
            )}
          </button>
        </nav>

        {/* Action Controls Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Table Switcher & QR scanner trigger for Customer */}
          {currentRole === 'customer' ? (
            <>
              {/* Scan QR Button */}
              <button
                onClick={onOpenQRScanner}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 font-bold text-xs transition-all shadow-xs"
                title="Scan physical table QR code"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Scan QR</span>
              </button>

              {/* Table Indicator Badge */}
              <button
                onClick={onOpenTableModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:border-amber-400 transition-colors"
                title="Seated Table - Click to switch or show stand"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate max-w-[80px] sm:max-w-none">{tableNumber.replace(/ \(.*\)/, '')}</span>
              </button>
            </>
          ) : (
            /* Staff / Kitchen Table QRs Button */
            <button
              onClick={onOpenTableQRModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-xs font-bold transition-colors"
              title="View & Print All Table QR Stands"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Table QRs / Stands</span>
            </button>
          )}

          {/* Quick Call Waiter & Request Bill (Customer only) */}
          {currentRole === 'customer' && (
            <>
              <button
                onClick={handleCallWaiter}
                className={`p-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center ${
                  currentTableActiveAlert?.type === 'call_waiter'
                    ? 'bg-amber-500 text-neutral-950 animate-pulse shadow-md'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
                title="Call Waiter to Table"
              >
                <Bell className="w-4 h-4" />
              </button>

              <button
                onClick={handleRequestBill}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                title="Request Bill"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Bill</span>
              </button>
            </>
          )}

          {/* Live Order Tracker Trigger (If customer has active order) */}
          {currentRole === 'customer' && activeTableOrder && (
            <button
              onClick={onOpenOrderTracker}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse"
              title="Track Order Status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Track #{activeTableOrder.orderNumber}</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Button (Customer role) */}
          {currentRole === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-sm transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="tabular-nums">{cartCount}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

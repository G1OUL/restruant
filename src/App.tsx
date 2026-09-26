import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/layout/Navbar';
import { CustomerView } from './components/customer/CustomerView';
import { WaiterView } from './components/waiter/WaiterView';
import { KitchenView } from './components/kitchen/KitchenView';
import { CartDrawer } from './components/customer/CartDrawer';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { TableSelectorModal } from './components/customer/TableSelectorModal';
import { QRScannerModal } from './components/qr/QRScannerModal';
import { TableQRModal } from './components/qr/TableQRModal';
import { RESTAURANT_INFO } from './data/restaurantData';
import { Phone, MapPin, QrCode, UtensilsCrossed, CheckCircle2, Camera } from 'lucide-react';

function RestaurantApp() {
  const { currentRole, tableNumber, setCurrentRole } = useRestaurant();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isTableQRModalOpen, setIsTableQRModalOpen] = useState(false);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  const handleScanSuccess = (newTable: string) => {
    setScanNotification(`Connected to ${newTable}! Menu loaded.`);
    setTimeout(() => setScanNotification(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      {/* Top Notification Toast for QR Scans */}
      {scanNotification && (
        <div className="fixed top-18 right-4 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-slideDown border border-emerald-400 max-w-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold">{scanNotification}</p>
            <p className="text-emerald-100 text-[11px] mt-0.5">
              Orders and waiter calls are now connected to this table.
            </p>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTableModal={() => setIsTableModalOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {currentRole === 'customer' && (
          <CustomerView
            onOpenCart={() => setIsCartOpen(true)}
            onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
            onOpenTableModal={() => setIsTableModalOpen(true)}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
          />
        )}

        {currentRole === 'waiter' && (
          <WaiterView
            onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
          />
        )}

        {currentRole === 'kitchen' && (
          <KitchenView
            onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
          />
        )}
      </main>

      {/* Slide-over Cart & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
      />

      {/* QR SCANNER MODAL */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* TABLE QR CODE & ACRYLIC STAND MODAL */}
      <TableQRModal
        isOpen={isTableQRModalOpen}
        onClose={() => setIsTableQRModalOpen(false)}
        onTestScan={handleScanSuccess}
      />

      {/* Clean Restaurant Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 text-xs text-neutral-500 transition-colors print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-neutral-900 dark:text-neutral-100 text-sm">
                  {RESTAURANT_INFO.name} ({RESTAURANT_INFO.hindiName})
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10">
                  {RESTAURANT_INFO.type}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Live & Parcel Orders · Free table service for orders worth Rs. 250 & above.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{RESTAURANT_INFO.contact.join(' / ')}</span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate max-w-xs">{RESTAURANT_INFO.landmark}, Nallasopara (E)</span>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
            <div>
              © {new Date().getFullYear()} {RESTAURANT_INFO.name}. Smart QR Restaurant Ordering & Service System.
            </div>

            {/* Quick QR & Role Switcher in Footer */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsQRScannerOpen(true)}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                <span>Camera Scanner</span>
              </button>
              <span>·</span>
              <button
                onClick={() => setIsTableQRModalOpen(true)}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <QrCode className="w-3 h-3" />
                <span>Table QR Stands</span>
              </button>
              <span>·</span>
              <span>View Mode:</span>
              <button
                onClick={() => setCurrentRole('customer')}
                className={`hover:underline font-semibold ${
                  currentRole === 'customer' ? 'text-amber-500' : 'text-neutral-400'
                }`}
              >
                Customer ({tableNumber.replace(/ \(.*\)/, '')})
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentRole('waiter')}
                className={`hover:underline font-semibold ${
                  currentRole === 'waiter' ? 'text-amber-500' : 'text-neutral-400'
                }`}
              >
                Waiter Console
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentRole('kitchen')}
                className={`hover:underline font-semibold ${
                  currentRole === 'kitchen' ? 'text-amber-500' : 'text-neutral-400'
                }`}
              >
                Kitchen KDS
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <RestaurantApp />
    </RestaurantProvider>
  );
}

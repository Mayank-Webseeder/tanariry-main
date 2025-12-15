'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WishlistProvider } from '@/context/WishlistContext';
// import { OrderNotificationProvider } from '@/context/OrderNotificationContext';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export default function ClientLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {/* <OrderNotificationProvider> */}
              {children}
              <Toaster position="top-right" />
            {/* </OrderNotificationProvider> */}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
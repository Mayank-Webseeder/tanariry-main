// app/products/page.js
import { Suspense } from 'react';
import ProductsContent from './ProductsContent';
import ErrorFallback from './ErrorFallback';  
import { fetchAllProducts } from '@/lib/api';

async function ProductsData() {
  try {
    const products = await fetchAllProducts();
    return <ProductsContent products={products} />;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return <ErrorFallback />;
  }
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsData />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1E3A8A] border-t-transparent mb-6"></div>
      <p className="text-xl text-gray-700">Loading premium collection...</p>
    </div>
  );
}
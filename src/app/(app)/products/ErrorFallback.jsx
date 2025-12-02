// app/products/ErrorFallback.jsx
'use client';

export default function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
      <h2 className="text-2xl font-bold text-red-600">Oops! Something went wrong</h2>
      <p className="text-gray-600 max-w-md">
        We couldn't load the products at the moment. Please try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#172554] transition font-medium"
      >
        Retry
      </button>
    </div>
  );
}
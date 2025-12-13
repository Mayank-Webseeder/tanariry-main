// src/hooks/useCurrency.js
import { useState, useEffect } from 'react';

export default function useCurrency() {
  const [isIndia, setIsIndia] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.country.is/')
      .then(res => res.json())
      .then(data => {
        const countryCode = data?.country || 'IN';
        setIsIndia(countryCode === 'IN');
        setLoading(false);
      })
      .catch(() => {
        setIsIndia(true); 
        setLoading(false);
      });
  }, []);

  const currencySymbol = isIndia ? '₹' : '$';

  const formatPrice = (amount) => {
    return Number(amount || 0).toLocaleString(isIndia ? 'en-IN' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return {
    isIndia,
    currencySymbol,
    formatPrice,
    loading,
  };
}
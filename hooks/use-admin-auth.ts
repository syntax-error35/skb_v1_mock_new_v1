"use client";

import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAdmin(authenticated);
      setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminToken' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { isAdmin, isLoading };
}

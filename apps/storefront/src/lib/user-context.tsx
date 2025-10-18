import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from './api';

interface CustomerProfile extends User {
  _id: string;
}

interface UserContextType {
  customer: CustomerProfile | null;
  setCustomer: (customer: CustomerProfile | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    const stored = localStorage.getItem('customer');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (customer) {
      localStorage.setItem('customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('customer');
    }
  }, [customer]);

  const logout = () => setCustomer(null);

  return (
    <UserContext.Provider value={{ customer, setCustomer, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
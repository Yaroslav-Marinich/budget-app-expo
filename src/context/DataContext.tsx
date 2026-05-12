import { auth } from '@/src/config/firebase';
import { Category, subscribeToCategories } from '@/src/services/categories';
import { Wallet, subscribeToWallets } from '@/src/services/wallets';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface DataContextType {
  categories: Category[];
  wallets: Wallet[];
  isDataReady: boolean;
}

const DataContext = createContext<DataContextType>({
  categories: [],
  wallets: [],
  isDataReady: false,
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  
  const [isCategoriesReady, setIsCategoriesReady] = useState(false);
  const [isWalletsReady, setIsWalletsReady] = useState(false);

  useEffect(() => {
    let unsubscribeCategories: (() => void) | undefined;
    let unsubscribeWallets: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        unsubscribeCategories = subscribeToCategories((data) => {
          setCategories(data);
          setIsCategoriesReady(true);
        });
        
        unsubscribeWallets = subscribeToWallets((data) => {
          setWallets(data);
          setIsWalletsReady(true);
        });
      } else {
        setCategories([]);
        setWallets([]);
        setIsCategoriesReady(true);
        setIsWalletsReady(true);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeCategories) unsubscribeCategories();
      if (unsubscribeWallets) unsubscribeWallets();
    };
  }, []);

  const isDataReady = isCategoriesReady && isWalletsReady;

  return (
    <DataContext.Provider value={{ categories, wallets, isDataReady }}>
      {children}
    </DataContext.Provider>
  );
};

export const useGlobalData = () => useContext(DataContext);
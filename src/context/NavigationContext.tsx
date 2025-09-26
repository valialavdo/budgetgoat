import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
  hideTabBar: boolean;
  setHideTabBar: (hide: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [hideTabBar, setHideTabBar] = useState(false);

  const contextValue = {
    hideTabBar,
    setHideTabBar,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
}

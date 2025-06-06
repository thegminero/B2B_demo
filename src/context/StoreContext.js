import { createContext, useContext, useState } from 'react';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [selectedStore, setSelectedStore] = useState('1'); // Default store
  const [persona, setPersona] = useState('public'); // public, wholesale
  
  const stores = {
    '1': { name: 'Sede Principal CDMX', city: 'Ciudad de México', address: 'Av. Reforma 123' },
    '2': { name: 'Sucursal Guadalajara', city: 'Guadalajara', address: 'Av. López Mateos 456' },
    '3': { name: 'Sucursal Monterrey', city: 'Monterrey', address: 'Av. Constitución 789' },
    '15': { name: 'Sucursal Puebla', city: 'Puebla', address: 'Blvd. 5 de Mayo 321' },
    '21': { name: 'Sucursal Tijuana', city: 'Tijuana', address: 'Av. Revolución 654' }
  };

  // Generate visibility filter based on persona
  const getVisibilityFilter = () => {
    if (persona === 'wholesale') {
      return 'visibility:public OR visibility:wholesale';
    } else {
      return 'visibility:public';
    }
  };

  return (
    <StoreContext.Provider value={{
      selectedStore,
      setSelectedStore,
      persona,
      setPersona,
      stores,
      getVisibilityFilter
    }}>
      {children}
    </StoreContext.Provider>
  );
}; 
// Provider de contexto para ficha
import React, { createContext, useState, useContext } from 'react';
import type { FichaDTO } from '../dto/FichaDTO';

interface FichaContextType {
  fichas: FichaDTO[];
  setFichas: (fichas: FichaDTO[]) => void;
}

const FichaContext = createContext<FichaContextType | undefined>(undefined);

export const FichaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fichas, setFichas] = useState<FichaDTO[]>([]);
  return (
    <FichaContext.Provider value={{ fichas, setFichas }}>
      {children}
    </FichaContext.Provider>
  );
};

export function useFichas() {
  const context = useContext(FichaContext);
  if (!context) throw new Error('useFichas deve ser usado dentro de FichaProvider');
  return context;
}

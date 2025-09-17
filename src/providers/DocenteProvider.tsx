// Provider de contexto para docente
import React, { createContext, useState, useContext } from 'react';
import type { DocenteDTO } from '../dto/DocenteDTO';

interface DocenteContextType {
  docentes: DocenteDTO[];
  setDocentes: (docentes: DocenteDTO[]) => void;
}

const DocenteContext = createContext<DocenteContextType | undefined>(undefined);

export const DocenteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [docentes, setDocentes] = useState<DocenteDTO[]>([]);
  return (
    <DocenteContext.Provider value={{ docentes, setDocentes }}>
      {children}
    </DocenteContext.Provider>
  );
};

export function useDocentes() {
  const context = useContext(DocenteContext);
  if (!context) throw new Error('useDocentes deve ser usado dentro de DocenteProvider');
  return context;
}

// Provider de contexto para disciplina
import React, { createContext, useState, useContext } from 'react';
import type { DisciplinaDTO } from '../dto/DisciplinaDTO';

interface DisciplinaContextType {
  disciplinas: DisciplinaDTO[];
  setDisciplinas: (disciplinas: DisciplinaDTO[]) => void;
}

const DisciplinaContext = createContext<DisciplinaContextType | undefined>(undefined);

export const DisciplinaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disciplinas, setDisciplinas] = useState<DisciplinaDTO[]>([]);
  return (
    <DisciplinaContext.Provider value={{ disciplinas, setDisciplinas }}>
      {children}
    </DisciplinaContext.Provider>
  );
};

export function useDisciplinas() {
  const context = useContext(DisciplinaContext);
  if (!context) throw new Error('useDisciplinas deve ser usado dentro de DisciplinaProvider');
  return context;
}

// Provider de contexto para usuário
import React, { createContext, useState, useContext } from 'react';
import type { UserDTO } from '../dto/UserDTO';

interface UserContextType {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado dentro de UserProvider');
  return context;
}

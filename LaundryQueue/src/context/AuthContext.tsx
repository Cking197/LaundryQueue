import { createContext, useState } from 'react';

export type User = {
  id: string;
  username: string;
};

type AuthContextValue = {
  currentUser: User;
  setCurrentUser: (u: User) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User>({ id: 'demo-user', username: 'Demo User' });

  return <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>;
};

import { createContext, useState } from 'react';

export type User = {
  id: string;
  username: string;
};

type AuthContextValue = {
  currentUser: User;
  setCurrentUser: (u: User) => void;
  users: User[];
  addUser: (username: string) => User;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: any) => {
  // Start with a single demo user by default
  const [users, setUsers] = useState<User[]>([{ id: 'demo-user', username: 'Demo User' }]);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);

  const addUser = (username: string) => {
    const id = `u-${Date.now()}`;
    const u = { id, username };
    setUsers((s) => [...s, u]);
    setCurrentUser(u);
    return u;
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, users, addUser }}>{children}</AuthContext.Provider>
  );
};

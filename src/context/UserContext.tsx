import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface UserContextType {
  user: any | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('aura_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
      });
      setUser(response.data);
      localStorage.setItem('aura_user', JSON.stringify(response.data));
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aura_user');
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

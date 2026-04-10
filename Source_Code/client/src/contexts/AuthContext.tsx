import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

/**
 * Định nghĩa kiểu dữ liệu cho User (Dựa theo Prisma UI)
 */
interface User {
  id: string;
  email: string;
  fullName: string;
  avatar: string | null;
  role: {
    id: number;
    name: string;
  };
  company?: {
    id: string;
    name: string;
  } | null;
}

/**
 * Interface cho Context quản lý Auth
 */
interface AuthContextType {
  user: User | null;
  token: string | null;   // Bổ sung để các bên khác (SocketContext) lấy token dễ dàng
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Khi ứng dụng được tải lần đầu, kiểm tra xem có Token cũ trong LocalStorage không
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      setToken(storedToken);

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Không thể xác thực token cũ:', error);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook giúp lấy dữ liệu Auth một cách dễ dàng ở bất kỳ Component nào.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543210',
    password: 'password',
    addresses: [
      {
        id: '1',
        label: 'Home',
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        isDefault: true
      }
    ]
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    password: 'password',
    addresses: [
      {
        id: '2',
        label: 'Office',
        street: '456 Brigade Road',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        isDefault: true
      }
    ]
  },
  {
    id: '3',
    name: 'Amit Singh',
    email: 'amit@example.com',
    phone: '+91-9876543212',
    password: 'password',
    addresses: [
      {
        id: '3',
        label: 'Home',
        street: '789 CP Road',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        isDefault: true
      }
    ]
  },
  {
    id: 'admin',
    name: 'Restaurant Admin',
    email: 'admin@restaurant.com',
    phone: '+91-9876543213',
    password: 'admin123',
    isAdmin: true,
    addresses: []
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      password: userData.password,
      addresses: []
    };

    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const switchProfile = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, switchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
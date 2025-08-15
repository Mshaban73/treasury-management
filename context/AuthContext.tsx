
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
    currentUser: User | null;
    users: User[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useLocalStorage<User[]>('users', INITIAL_USERS);
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const storedUser = sessionStorage.getItem('currentUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const login = (username: string, password: string): boolean => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            const userToStore = { ...user };
            delete userToStore.password; // Don't store password in session storage
            setCurrentUser(userToStore);
            sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
    };

    const addUser = (user: Omit<User, 'id'>) => {
        const newUser: User = { ...user, id: new Date().toISOString() };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    return (
        <AuthContext.Provider value={{ currentUser, users, login, logout, addUser, updateUser, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

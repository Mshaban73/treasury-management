
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginComponent from './components/LoginComponent';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            {currentUser ? <Dashboard /> : <LoginComponent />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;

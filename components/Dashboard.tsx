
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LogoutIcon, UserIcon } from './icons';
import TransactionsView from './TransactionsView';
import DailyCountView from './DailyCountView';
import UsersView from './UsersView';

const Header: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-cyan-400">إدارة الخزينة</h1>
                <p className="text-sm text-gray-400">
                    {currentTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {' | '}
                    {currentTime.toLocaleTimeString('ar-EG')}
                </p>
            </div>
            <div className="flex items-center space-x-4">
                 <div className="flex items-center gap-2">
                    <UserIcon className="h-6 w-6 text-gray-400" />
                    <span className="font-semibold">{currentUser?.username}</span>
                </div>
                <button onClick={logout} className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-gray-700">
                    <LogoutIcon className="h-5 w-5" />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </header>
    );
}

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('transactions');
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === UserRole.ADMIN;

    const renderView = () => {
        switch (activeTab) {
            case 'transactions':
                return <TransactionsView />;
            case 'dailyCount':
                return <DailyCountView />;
            case 'users':
                return isAdmin ? <UsersView /> : null;
            default:
                return <TransactionsView />;
        }
    };

    const getTabClass = (tabName: string) => 
        `px-4 py-3 font-semibold text-sm rounded-t-lg transition-colors border-b-4 ${
        activeTab === tabName 
        ? 'border-cyan-400 text-cyan-400' 
        : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'}`;

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <nav className="bg-gray-800/50 px-4">
                <div className="flex border-b border-gray-700">
                    <button onClick={() => setActiveTab('transactions')} className={getTabClass('transactions')}>
                        الحركات المالية
                    </button>
                    <button onClick={() => setActiveTab('dailyCount')} className={getTabClass('dailyCount')}>
                        الجرد اليومي
                    </button>
                    {isAdmin && (
                        <button onClick={() => setActiveTab('users')} className={getTabClass('users')}>
                            إدارة المستخدمين
                        </button>
                    )}
                </div>
            </nav>
            <main className="flex-grow p-6 overflow-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default Dashboard;

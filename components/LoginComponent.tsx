
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!login(username, password)) {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-cyan-400">نظام إدارة الخزينة</h1>
                    <p className="mt-2 text-gray-400">يرجى تسجيل الدخول للمتابعة</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">اسم المستخدم</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-gray-100 rounded-t-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                                placeholder="اسم المستخدم"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-address" className="sr-only">كلمة المرور</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-gray-100 rounded-b-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                                placeholder="كلمة المرور"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
                        >
                            تسجيل الدخول
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;

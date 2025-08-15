
import React, { useState, useMemo } from 'react';
import { Transaction, UserRole } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import { EditIcon, DeleteIcon, PlusIcon } from './icons';

const initialTransactionState: Omit<Transaction, 'id' | 'balance'> = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    incoming: 0,
    outgoing: 0,
    notes: ''
};

const TransactionForm: React.FC<{
    initialData: Omit<Transaction, 'id' | 'balance'> | Transaction,
    onSubmit: (transaction: Omit<Transaction, 'id' | 'balance'> | Transaction) => void,
    onCancel: () => void
}> = ({ initialData, onSubmit, onCancel }) => {
    const [transaction, setTransaction] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTransaction(prev => ({
            ...prev,
            [name]: name === 'incoming' || name === 'outgoing' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(transaction);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">التاريخ</label>
                    <input type="date" name="date" value={transaction.date.split('T')[0]} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">البيان</label>
                    <input type="text" name="description" value={transaction.description} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">الوارد</label>
                    <input type="number" step="0.01" name="incoming" value={transaction.incoming} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">المنصرف</label>
                    <input type="number" step="0.01" name="outgoing" value={transaction.outgoing} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ملاحظات</label>
                <textarea name="notes" value={transaction.notes} onChange={handleChange} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"></textarea>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white transition-colors">حفظ</button>
            </div>
        </form>
    );
};


const TransactionsView: React.FC = () => {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [filters, setFilters] = useState({ startDate: '', endDate: '' });
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === UserRole.ADMIN;

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;
            if(startDate && transactionDate < startDate) return false;
            if(endDate && transactionDate > endDate) return false;
            return true;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, filters]);


    const transactionsWithBalance = useMemo(() => {
        let balance = 0;
        const allSorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const balanceMap = new Map<string, number>();
        for (const t of allSorted) {
            balance += t.incoming - t.outgoing;
            balanceMap.set(t.id, balance);
        }
        return filteredTransactions.map(t => ({...t, balance: balanceMap.get(t.id) || 0}));
    }, [transactions, filteredTransactions]);

    const totals = useMemo(() => {
        return filteredTransactions.reduce((acc, t) => {
            acc.incoming += t.incoming;
            acc.outgoing += t.outgoing;
            return acc;
        }, { incoming: 0, outgoing: 0 });
    }, [filteredTransactions]);
    
    const finalBalance = transactionsWithBalance.length > 0 ? transactionsWithBalance[0].balance : 0;

    const handleAdd = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الحركة؟')) {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    };
    
    const handleFormSubmit = (transaction: Omit<Transaction, 'id' | 'balance'> | Transaction) => {
        if ('id' in transaction) {
            // Editing
            setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
        } else {
            // Adding
            setTransactions(prev => [...prev, { ...transaction, id: new Date().toISOString() }]);
        }
        setIsModalOpen(false);
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center p-4 bg-gray-800 rounded-lg shadow">
                <div className="flex flex-wrap gap-4 items-center">
                    <div>
                        <label className="text-sm text-gray-400">من تاريخ:</label>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">إلى تاريخ:</label>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                    </div>
                </div>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-colors">
                    <PlusIcon />
                    إضافة حركة جديدة
                </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-300">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                                <th scope="col" className="px-6 py-3">البيان</th>
                                <th scope="col" className="px-6 py-3">الوارد</th>
                                <th scope="col" className="px-6 py-3">المنصرف</th>
                                <th scope="col" className="px-6 py-3">الرصيد</th>
                                <th scope="col" className="px-6 py-3">الملاحظات</th>
                                {isAdmin && <th scope="col" className="px-6 py-3">الإجراءات</th>}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-gray-700 font-bold">
                                <td className="px-6 py-3 text-cyan-400" colSpan={2}>الإجماليات</td>
                                <td className="px-6 py-3 text-green-400">{formatCurrency(totals.incoming)}</td>
                                <td className="px-6 py-3 text-red-400">{formatCurrency(totals.outgoing)}</td>
                                <td className="px-6 py-3 text-yellow-400">{formatCurrency(finalBalance)}</td>
                                <td className="px-6 py-3" colSpan={isAdmin ? 2 : 1}></td>
                            </tr>
                            {transactionsWithBalance.map((t) => (
                                <tr key={t.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('ar-EG')}</td>
                                    <td className="px-6 py-4">{t.description}</td>
                                    <td className="px-6 py-4 text-green-400">{t.incoming > 0 ? formatCurrency(t.incoming) : '-'}</td>
                                    <td className="px-6 py-4 text-red-400">{t.outgoing > 0 ? formatCurrency(t.outgoing) : '-'}</td>
                                    <td className="px-6 py-4 font-semibold">{formatCurrency(t.balance)}</td>
                                    <td className="px-6 py-4">{t.notes || '-'}</td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300"><EditIcon /></button>
                                            <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300"><DeleteIcon /></button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                             {transactionsWithBalance.length === 0 && (
                                <tr className="bg-gray-800">
                                    <td colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-gray-400">لا توجد حركات لعرضها.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTransaction ? 'تعديل حركة' : 'إضافة حركة جديدة'}>
                <TransactionForm
                    initialData={editingTransaction || initialTransactionState}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default TransactionsView;
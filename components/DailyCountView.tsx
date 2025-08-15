import React, { useState, useMemo, useEffect } from 'react';
import { DailyCount, DenominationCount, Transaction, UserRole } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { DENOMINATIONS } from '../constants';
import Modal from './Modal';
import { PlusIcon, EyeIcon, DeleteIcon } from './icons';

const DailyCountForm: React.FC<{
    systemBalance: number;
    onSubmit: (newCount: Omit<DailyCount, 'id'>) => void;
    onCancel: () => void;
}> = ({ systemBalance, onSubmit, onCancel }) => {
    const [counts, setCounts] = useState<DenominationCount[]>(DENOMINATIONS.map(d => ({ denomination: d, count: 0, total: 0 })));
    const { currentUser } = useAuth();
    
    const handleCountChange = (denomination: number, count: number) => {
        setCounts(prev => prev.map(c => 
            c.denomination === denomination 
            ? { ...c, count, total: denomination * count } 
            : c
        ));
    };

    const countedTotal = useMemo(() => counts.reduce((acc, c) => acc + c.total, 0), [counts]);
    const difference = countedTotal - systemBalance;

    let status: DailyCount['status'] = 'مطابق';
    if (difference > 0) status = 'زيادة';
    if (difference < 0) status = 'عجز';
    
    const handleSubmit = () => {
        if(!currentUser) return;
        onSubmit({
            date: new Date().toISOString(),
            countedBy: currentUser.username,
            denominations: counts,
            countedTotal,
            systemBalance,
            difference,
            status,
        });
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 p-3 bg-gray-700/50 rounded-lg">
                <div className="text-center">
                    <p className="text-sm text-gray-400">رصيد النظام</p>
                    <p className="text-lg font-bold text-yellow-400">{formatCurrency(systemBalance)}</p>
                </div>
                 <div className="text-center">
                    <p className="text-sm text-gray-400">المبلغ المعدود</p>
                    <p className="text-lg font-bold text-cyan-400">{formatCurrency(countedTotal)}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">الفرق</p>
                    <p className={`text-lg font-bold ${difference === 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(difference)} ({status})
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 font-semibold text-gray-300 border-b border-gray-600 pb-2">
                <div className="text-right">الفئة</div>
                <div className="text-center">العدد</div>
                <div className="text-left">المجموع</div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {counts.map(({ denomination, count, total }) => (
                    <div key={denomination} className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-right font-bold">{denomination}</div>
                        <div className="text-center">
                            <input
                                type="number"
                                value={count}
                                onChange={(e) => handleCountChange(denomination, parseInt(e.target.value) || 0)}
                                className="w-24 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-center"
                            />
                        </div>
                        <div className="text-left text-gray-400">{formatCurrency(total)}</div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700 mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">إلغاء</button>
                <button type="button" onClick={handleSubmit} className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white transition-colors">حفظ الجرد</button>
            </div>
        </div>
    );
};

const DailyCountView: React.FC = () => {
    const [dailyCounts, setDailyCounts] = useLocalStorage<DailyCount[]>('dailyCounts', []);
    const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [isCountModalOpen, setIsCountModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCount, setSelectedCount] = useState<DailyCount | null>(null);
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === UserRole.ADMIN;

    const systemBalance = useMemo(() => {
        return transactions.reduce((acc, t) => acc + t.incoming - t.outgoing, 0);
    }, [transactions]);
    
    const handleNewCount = () => setIsCountModalOpen(true);
    
    const handleViewCount = (count: DailyCount) => {
        setSelectedCount(count);
        setIsViewModalOpen(true);
    };
    
    const handleFormSubmit = (newCount: Omit<DailyCount, 'id'>) => {
        setDailyCounts(prev => [{ ...newCount, id: new Date().toISOString() }, ...prev]);
        setIsCountModalOpen(false);
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('هل أنت متأكد من حذف هذا الجرد؟ لا يمكن التراجع عن هذا الإجراء.')){
            setDailyCounts(prev => prev.filter(c => c.id !== id));
        }
    }

    const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow">
                <h2 className="text-xl font-bold">سجل الجرد اليومي</h2>
                <button onClick={handleNewCount} className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-colors">
                    <PlusIcon />
                    جرد جديد
                </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-right text-gray-300">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                           <tr>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                                <th scope="col" className="px-6 py-3">المستخدم</th>
                                <th scope="col" className="px-6 py-3">رصيد النظام</th>
                                <th scope="col" className="px-6 py-3">المبلغ المعدود</th>
                                <th scope="col" className="px-6 py-3">الفرق</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyCounts.map(count => (
                                <tr key={count.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4">{new Date(count.date).toLocaleString('ar-EG')}</td>
                                    <td className="px-6 py-4">{count.countedBy}</td>
                                    <td className="px-6 py-4">{formatCurrency(count.systemBalance)}</td>
                                    <td className="px-6 py-4">{formatCurrency(count.countedTotal)}</td>
                                    <td className={`px-6 py-4 font-semibold ${count.difference === 0 ? 'text-gray-300' : 'text-red-400'}`}>{formatCurrency(count.difference)}</td>
                                    <td className={`px-6 py-4 font-bold ${count.status === 'مطابق' ? 'text-green-400' : count.status === 'زيادة' ? 'text-yellow-400' : 'text-red-400'}`}>{count.status}</td>
                                    <td className="px-6 py-4 flex gap-4">
                                        <button onClick={() => handleViewCount(count)} className="text-cyan-400 hover:text-cyan-300"><EyeIcon /></button>
                                        {isAdmin && (
                                            <button onClick={() => handleDelete(count.id)} className="text-red-400 hover:text-red-300"><DeleteIcon /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                             {dailyCounts.length === 0 && (
                                <tr className="bg-gray-800">
                                    <td colSpan={7} className="text-center py-8 text-gray-400">لا توجد سجلات جرد لعرضها.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isCountModalOpen} onClose={() => setIsCountModalOpen(false)} title="جرد الخزينة اليومي">
                <DailyCountForm systemBalance={systemBalance} onSubmit={handleFormSubmit} onCancel={() => setIsCountModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`تفاصيل جرد يوم ${selectedCount ? new Date(selectedCount.date).toLocaleDateString('ar-EG') : ''}`}>
               {selectedCount && (
                 <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-4 p-3 bg-gray-700/50 rounded-lg">
                        <div className="text-center"><p className="text-sm text-gray-400">رصيد النظام</p><p className="font-bold text-yellow-400">{formatCurrency(selectedCount.systemBalance)}</p></div>
                        <div className="text-center"><p className="text-sm text-gray-400">المبلغ المعدود</p><p className="font-bold text-cyan-400">{formatCurrency(selectedCount.countedTotal)}</p></div>
                        <div className="text-center"><p className="text-sm text-gray-400">الفرق</p><p className={`font-bold ${selectedCount.difference === 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(selectedCount.difference)} ({selectedCount.status})</p></div>
                     </div>
                     <div className="grid grid-cols-3 gap-4 font-semibold text-gray-300 border-b border-gray-600 pb-2">
                        <div className="text-right">الفئة</div><div className="text-center">العدد</div><div className="text-left">المجموع</div>
                     </div>
                     <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {selectedCount.denominations.map(d => (
                           <div key={d.denomination} className="grid grid-cols-3 gap-4">
                              <div className="text-right font-bold">{d.denomination}</div>
                              <div className="text-center">{d.count}</div>
                              <div className="text-left">{formatCurrency(d.total)}</div>
                           </div>
                        ))}
                     </div>
                 </div>
               )}
            </Modal>
        </div>
    );
};

export default DailyCountView;
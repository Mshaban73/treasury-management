
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import { EditIcon, DeleteIcon, PlusIcon, UserIcon } from './icons';

const UserForm: React.FC<{
    initialData: Omit<User, 'id'> | User,
    onSubmit: (user: Omit<User, 'id'> | User) => void,
    onCancel: () => void
}> = ({ initialData, onSubmit, onCancel }) => {
    const [user, setUser] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(user);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">اسم المستخدم</label>
                <input type="text" name="username" value={user.username} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">كلمة المرور</label>
                <input type="password" name="password" value={user.password || ''} onChange={handleChange} required={'id' in user ? false : true} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500" placeholder={'id' in user ? 'اتركها فارغة لعدم التغيير' : 'كلمة مرور جديدة'} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">الدور</label>
                <select name="role" value={user.role} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                    <option value={UserRole.USER}>مستخدم</option>
                    <option value={UserRole.ADMIN}>مدير</option>
                </select>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white transition-colors">حفظ</button>
            </div>
        </form>
    );
};


const UsersView: React.FC = () => {
    const { users, addUser, updateUser, deleteUser, currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (userId: string) => {
        if(userId === currentUser?.id) {
            alert("لا يمكنك حذف حسابك الخاص.");
            return;
        }
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            deleteUser(userId);
        }
    };
    
    const handleFormSubmit = (user: Omit<User, 'id'> | User) => {
        if ('id' in user) {
            const userToUpdate = { ...user };
            if (!user.password) {
                 const originalUser = users.find(u => u.id === user.id);
                 userToUpdate.password = originalUser?.password;
            }
            updateUser(userToUpdate);
        } else {
             if(!user.password) {
                alert("كلمة المرور مطلوبة للمستخدم الجديد.");
                return;
            }
            addUser(user as Omit<User, 'id'> & { password: string });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow">
                 <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-colors">
                    <PlusIcon />
                    إضافة مستخدم
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.id} className="bg-gray-800 rounded-lg shadow p-5 flex flex-col justify-between">
                        <div className="flex items-start gap-4">
                            <div className="bg-gray-700 p-3 rounded-full">
                                <UserIcon className="h-8 w-8 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{user.username}</h3>
                                <p className={`text-sm font-semibold px-2 py-0.5 rounded-full inline-block ${user.role === UserRole.ADMIN ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                    {user.role === UserRole.ADMIN ? 'مدير' : 'مستخدم'}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                             <button onClick={() => handleEdit(user)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                                <EditIcon className="h-4 w-4"/> تعديل
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm" disabled={user.id === currentUser?.id}>
                                <DeleteIcon className="h-4 w-4" /> حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}>
                <UserForm
                    initialData={editingUser || { username: '', password: '', role: UserRole.USER }}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default UsersView;

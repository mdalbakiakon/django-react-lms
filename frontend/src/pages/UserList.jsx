import { useState, useEffect, useContext } from 'react';
import api from '../api';
import NotificationContext from '../context/NotificationContext';
import AuthContext from '../context/AuthContext';
import { Trash2, User, UserCheck, Shield, Search, Filter } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { motion } from 'framer-motion';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { showNotification } = useContext(NotificationContext);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('auth/users/');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            showNotification("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`auth/users/${userToDelete.id}/`);
            setUsers(users.filter(u => u.id !== userToDelete.id));
            showNotification("User deleted successfully", "success");
            setDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            showNotification("Failed to delete user", "error");
        }
    };

    const filteredUsers = filterRole === 'all'
        ? users
        : users.filter(user => user.role === filterRole);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Identity <span className='text-primary font-accent italic'>Manager</span>
                    </h1>
                    <p className="text-text-muted mt-1 font-medium italic">Administrative control over platform users</p>
                </div>

                <div className="flex items-center gap-3 bg-surface border border-white/5 p-1.5 rounded-2xl overflow-hidden shadow-2xl">
                    {['all', 'student', 'instructor', 'admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black capitalize transition-all duration-300 ${filterRole === role
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-white/5 rounded-[40px] shadow-2xl overflow-hidden"
            >
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background/50 text-text-muted text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="px-8 py-6 font-black">Identity</th>
                                <th className="px-8 py-6 font-black">Permissions</th>
                                <th className="px-8 py-6 font-black">Contact Vector</th>
                                <th className="px-8 py-6 font-black text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition duration-300 group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-[18px] bg-background border border-white/10 flex items-center justify-center text-primary font-black text-xl shadow-inner group-hover:border-primary/50 transition-all overflow-hidden">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.username.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-lg">{user.username}</p>
                                                    <p className="text-text-muted font-medium tracking-wide uppercase opacity-60" style={{ fontSize: '12px' }}>Member ID: #{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                user.role === 'instructor' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-primary/10 text-primary border-primary/20'
                                                }`}>
                                                {user.role === 'admin' && <Shield size={12} className="mr-2" />}
                                                {user.role === 'instructor' && <UserCheck size={12} className="mr-2" />}
                                                {user.role === 'student' && <User size={12} className="mr-2" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm text-text-muted font-bold">
                                            {user.email}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            {user.id !== currentUser?.id ? (
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="p-3 bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-xl shadow-red-500/5 group-hover:scale-110"
                                                    title="Permanently Remove User"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest mr-2">Your Account</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                                            <Search size={32} className="text-text-muted opacity-40" />
                                        </div>
                                        <h3 className="text-xl font-black text-white">No matches found</h3>
                                        <p className="text-text-muted mt-2">Adjust your filters to see more results</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-6 p-6">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="bg-background/50 rounded-[24px] p-6 border border-white/5 flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-[20px] bg-surface flex items-center justify-center text-primary font-black text-2xl border border-white/10 shrink-0">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-[20px]" />
                                        ) : (
                                            user.username.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-white text-xl truncate">{user.username}</h3>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border mt-2 ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            user.role === 'instructor' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                    <p className="text-xs text-text-muted font-bold truncate pr-4">{user.email}</p>
                                    {user.id !== currentUser?.id && (
                                        <button
                                            onClick={() => confirmDelete(user)}
                                            className="p-3 bg-red-500/10 text-red-400 rounded-xl"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-text-muted">
                            No users found matching filter.
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="text-center text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40">
                Active System Records: {filteredUsers.length}
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={executeDelete}
                title="Account Removal"
                message={`Verify permanent deletion of ${userToDelete?.username}'s account. All user-generated content and access will be revoked.`}
                confirmText="Execute Deletion"
                cancelText="Abort Operation"
                isDestructive={true}
            />
        </div>
    );
};

export default UserList;

import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import api from '../api';
import { Eye, EyeOff, Camera, User, Mail, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user: authUser, logout, login } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: ''
    });

    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (authUser) {
            setFormData(prev => ({
                ...prev,
                username: authUser.username,
                email: authUser.email,
                first_name: authUser.first_name || '',
                last_name: authUser.last_name || ''
            }));
            if (authUser.avatar) {
                setPreview(authUser.avatar);
            }
        }
    }, [authUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password && formData.password !== formData.confirm_password) {
            showNotification("Passwords do not match", 'error');
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('first_name', formData.first_name);
        data.append('last_name', formData.last_name);
        if (formData.password) {
            data.append('password', formData.password);
        }
        if (avatar) {
            data.append('avatar', avatar);
        }

        try {
            await api.put('auth/profile/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showNotification('Profile updated successfully!', 'success');
        } catch (err) {
            console.error(err);
            showNotification('Failed to update profile.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Profile <span className='text-primary font-accent italic'>Settings</span>
                    </h1>
                    <p className="text-text-muted mt-1 font-medium italic">Manage your account information and security</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Card */}
                <div className="lg:col-span-4">
                    <div className="bg-surface border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden text-center sticky top-28">
                        {/* Avatar Section */}
                        <div className="relative z-10">
                            <div className="relative inline-block mb-6 group">
                                <div className="w-40 h-40 rounded-[40px] overflow-hidden border-2 border-primary/20 bg-background flex items-center justify-center text-primary group-hover:border-primary transition-all duration-300 shadow-2xl">
                                    {preview ? (
                                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={80} strokeWidth={1.5} />
                                    )}
                                </div>
                                <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl cursor-pointer hover:bg-primary-dark transition shadow-xl hover:scale-110 active:scale-95 border-4 border-surface">
                                    <Camera size={20} />
                                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>

                            <h2 className="text-2xl font-black text-white">
                                {authUser?.first_name ? `${authUser.first_name} ${authUser.last_name || ''}` : authUser?.username}
                            </h2>
                            <p className="text-primary font-black uppercase tracking-widest text-xs mt-2">{authUser?.role}</p>

                            <div className="mt-8 space-y-4 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-3 text-text-muted text-sm font-medium">
                                    <Mail size={16} className="text-primary" />
                                    <span className="truncate">{authUser?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-muted text-sm font-medium">
                                    <Shield size={16} className="text-primary" />
                                    <span>Verified Account</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-surface border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-white flex items-center gap-2">
                                    <User size={20} className="text-primary" /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full bg-background border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Account Role</label>
                                        <input
                                            type="text"
                                            value={authUser?.role || ''}
                                            disabled
                                            className="w-full bg-background/50 border border-white/5 rounded-2xl px-5 py-4 text-text-muted font-black uppercase tracking-tighter cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full bg-background border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full bg-background border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-background border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                                <h3 className="text-xl font-black text-white flex items-center gap-2">
                                    <Lock size={20} className="text-primary" /> Security Update
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-text-muted hover:text-white transition-colors">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Confirm Update</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirm_password"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium"
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-4 text-text-muted hover:text-white transition-colors">
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary hover:bg-primary-dark text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? 'Encrypting Details...' : 'Sync Profile'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

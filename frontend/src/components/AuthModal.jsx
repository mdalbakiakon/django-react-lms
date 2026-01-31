import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import { X, User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const AuthModal = () => {
    const { isModalOpen, modalView, closeModal, setModalView } = useModal();
    const { login } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reset form when modal opens or view changes
    useEffect(() => {
        if (isModalOpen) {
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                password: '',
                confirm_password: '',
                role: 'student'
            });
            setLoading(false);
        }
    }, [isModalOpen, modalView]);

    if (!isModalOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.username, formData.password);
            showNotification('Welcome back!', 'success');
            closeModal();
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            showNotification('Login failed. Please check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            showNotification("Passwords do not match", 'error');
            return;
        }
        setLoading(true);
        try {
            await api.post('auth/register/', {
                username: formData.username,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password,
                role: formData.role
            });
            showNotification('Registration successful! Please login.', 'success');
            setModalView('login');
        } catch (error) {
            console.error(error);
            showNotification('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('auth/password-reset/', { email: formData.email });
            showNotification('If an account exists, a reset link has been sent.', 'success');
            setModalView('login');
        } catch (error) {
            showNotification('Failed to send reset email.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, x: -10, transition: { duration: 0.3 } }
    };

    const renderLogin = () => (
        <motion.form
            key="login"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleLogin}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white">Welcome Back</h2>
                <p className="text-text-muted text-sm mt-2">Enter your details to access your account</p>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                    <User size={18} />
                </div>
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white placeholder-text-muted/60 transition-all font-medium" required />
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white placeholder-text-muted/60 transition-all font-medium"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-white transition-colors focus:outline-none"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <div className="text-right">
                <button type="button" onClick={() => setModalView('forgot-password')} className="text-xs font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-wider">Forgot Password?</button>
            </div>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/10"
            >
                {loading ? 'Logging in...' : 'Sign In'}
            </motion.button>

            <p className="text-center text-sm text-text-muted mt-8 font-medium">
                New to Code <span className="font-accent italic">Station</span>? <button type="button" onClick={() => setModalView('register')} className="font-bold text-white hover:text-primary transition-colors ml-1">Create Account</button>
            </p>
        </motion.form>
    );

    const renderRegister = () => (
        <motion.form
            key="register"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleRegister}
            className="space-y-4"
        >
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-white">Join Code <span className="text-primary font-accent italic text-4xl">Station</span></h2>
                <p className="text-text-muted text-sm mt-2">Start your learning journey today</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white" />
                </div>
                <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white" />
                </div>
            </div>

            <div className="relative group">
                <User className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white" required />
            </div>

            <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white" required />
            </div>

            <div className="relative group">
                <Shield className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white cursor-pointer appearance-none">
                    <option value="student">Student Account</option>
                    <option value="instructor">Instructor Account</option>
                    <option value="admin">System Administrator</option>
                </select>
            </div>

            <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white"
                    required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-text-muted hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white"
                    required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-3.5 text-text-muted hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 mt-4"
            >
                {loading ? 'Processing...' : 'Create Account'}
            </motion.button>

            <p className="text-center text-sm text-text-muted mt-6 font-medium">
                Already have an account? <button type="button" onClick={() => setModalView('login')} className="font-bold text-white hover:text-primary transition-colors ml-1">Sign In</button>
            </p>
        </motion.form >
    );

    const renderForgotPassword = () => (
        <motion.form
            key="forgot-password"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleForgotPassword}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white">Reset Password</h2>
                <p className="text-text-muted text-sm mt-2">Enter your email and we'll send you a recovery link</p>
            </div>

            <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-white/5 focus:border-primary/50 outline-none text-white placeholder-text-muted/60" required />
            </div>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/10"
            >
                {loading ? 'Sending...' : 'Send Recovery Link'}
            </motion.button>

            <p className="text-center text-sm text-text-muted mt-8 font-medium">
                <button type="button" onClick={() => setModalView('login')} className="font-bold text-white hover:text-primary transition-colors">Back to Sign In</button>
            </p>
        </motion.form>
    );

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        className="bg-surface p-8 md:p-12 rounded-[24px] w-full max-w-[500px] relative shadow-2xl border border-white/5 overflow-hidden"
                    >
                        <button onClick={closeModal} className="absolute top-6 right-6 text-text-muted hover:text-white transition-all hover:rotate-90 transform duration-300 z-10 p-2">
                            <X size={24} />
                        </button>

                        <AnimatePresence mode="wait">
                            {modalView === 'login' && renderLogin()}
                            {modalView === 'register' && renderRegister()}
                            {modalView === 'forgot-password' && renderForgotPassword()}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;

import { Link, useLocation } from 'react-router-dom';
import {
    Terminal,
    LayoutDashboard,
    BookOpen,
    Users,
    UserCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const getActiveClass = (path) => {
        return location.pathname === path ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-text-muted hover:bg-white/5 hover:text-white';
    };

    const baseClasses = "flex items-center px-6 py-4 transition-all duration-300 group relative";

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                bg-surface text-text-main flex flex-col h-screen fixed left-0 top-0 z-[100] border-r border-white/5
                transition-all duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'w-24' : 'w-72'}
                ${user ? 'lg:translate-x-0' : 'lg:-translate-x-full lg:hidden'}
            `}>
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden w-full pt-8">
                    {/* Brand Logo */}
                    <div className={`px-6 mb-10 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                        {!isCollapsed && (
                            <div className="animate-fade-in whitespace-nowrap overflow-hidden">
                                <Link to="/" onClick={onClose}>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black tracking-tight text-white leading-tight">
                                            Code <span className="text-primary font-accent italic">Station</span>
                                        </span>
                                        <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] opacity-60 leading-none">
                                            LMS Platform
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        )}
                        {isCollapsed && (
                            <div className="text-primary p-2 bg-primary/10 rounded-xl">
                                <Terminal size={32} />
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-1">
                        <Link to="/dashboard" onClick={onClose} className={`${baseClasses} ${getActiveClass('/dashboard')} rounded-xl`}>
                            <LayoutDashboard size={24} className="shrink-0" />
                            {!isCollapsed && <span className="ml-4 font-bold text-lg">Dashboard</span>}
                        </Link>

                        <Link to="/courses" onClick={onClose} className={`${baseClasses} ${getActiveClass('/courses')} rounded-xl`}>
                            <BookOpen size={24} className="shrink-0" />
                            {!isCollapsed && <span className="ml-4 font-bold text-lg">Courses</span>}
                        </Link>

                        {user?.role === 'admin' && (
                            <Link to="/users" onClick={onClose} className={`${baseClasses} ${getActiveClass('/users')} rounded-xl`}>
                                <Users size={24} className="shrink-0" />
                                {!isCollapsed && <span className="ml-4 font-bold text-lg">Manage Users</span>}
                            </Link>
                        )}

                        <div className="pt-6 pb-2 px-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest text-text-muted ${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
                            {isCollapsed && <div className="h-px bg-white/5 w-full"></div>}
                        </div>

                        <Link to="/profile" onClick={onClose} className={`${baseClasses} ${getActiveClass('/profile')} rounded-xl`}>
                            <UserCircle size={24} className="shrink-0" />
                            {!isCollapsed && <span className="ml-4 font-bold text-lg">Profile</span>}
                        </Link>

                        <button onClick={logout} className={`${baseClasses} w-full text-red-400 hover:bg-red-400/10 rounded-xl`}>
                            <LogOut size={24} className="shrink-0" />
                            {!isCollapsed && <span className="ml-4 font-bold text-lg">Logout</span>}
                        </button>
                    </nav>

                    {/* Collapse Button (Desktop Only) */}
                    <button
                        onClick={toggleCollapse}
                        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface border border-white/10 rounded-full items-center justify-center text-text-muted hover:text-white transition-all shadow-xl z-50"
                    >
                        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                    </button>
                </div>

                {/* Bottom Stats */}
                {!isCollapsed && (
                    <div className="p-6 m-4 bg-background/50 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase">System Status</span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                        <p className="text-[10px] text-white/50 font-medium">All services operational</p>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;

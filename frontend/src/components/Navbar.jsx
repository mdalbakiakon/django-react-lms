import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import ModalContext from '../context/ModalContext';
import { Menu, LogOut, X, Search, Bell } from 'lucide-react';

const Navbar = ({ onMenuClick, isCollapsed, isSidebarOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const { openModal } = useContext(ModalContext);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navbarWidthClass = user
        ? (isCollapsed ? 'lg:w-[calc(100%-6rem)] lg:ml-24' : 'lg:w-[calc(100%-18rem)] lg:ml-72')
        : 'w-full';

    return (
        <nav
            className={`fixed top-0 right-0 z-[90] h-20 transition-all duration-300 ${navbarWidthClass} ${isScrolled ? 'bg-surface/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
                }`}
        >
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    {onMenuClick && (
                        <button onClick={onMenuClick} className="lg:hidden text-text-muted hover:text-white transition-colors p-2">
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}

                    <Link to="/" className="text-2xl font-black text-white px-2 tracking-tight group">
                        Code <span className="text-primary font-accent italic transition-colors group-hover:text-white">Station</span>
                    </Link>

                    {user && (
                        <div className="hidden md:flex items-center bg-background border border-white/5 rounded-full px-4 py-1.5 focus-within:border-primary/50 transition-all group">
                            <Search size={18} className="text-text-muted group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="bg-transparent border-none outline-none text-sm text-white ml-2 w-48 lg:w-64"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-6">
                    {/* Desktop Navigation Links */}
                    {!user && (
                        <div className="hidden md:flex items-center gap-6 mr-4">
                            <Link to="/courses" className="text-text-muted hover:text-white transition font-medium">Browse Courses</Link>
                        </div>
                    )}

                    {user ? (
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-text-muted hover:text-white transition relative">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1"></div>

                            <div className="flex items-center gap-2">
                                <span className="text-white font-semibold hidden sm:inline ml-1 text-sm">{user.username}</span>
                                {user.avatar ? (
                                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <button onClick={logout} className="ml-2 text-text-muted hover:text-red-400 transition" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => openModal('login')}
                                className="text-white hover:text-primary transition font-bold px-4 py-2"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => openModal('register')}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-all font-bold text-sm shadow-lg shadow-primary/20"
                            >
                                Join Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

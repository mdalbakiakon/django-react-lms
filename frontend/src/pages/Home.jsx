import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import CourseList from './CourseList';
import PageTransition from '../components/PageTransition';
import AuthContext from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import Dashboard from './Dashboard';
import { ChevronRight, PlayCircle, Trophy, Users as UsersIcon, Code, Cpu, Globe, ArrowRight } from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext);
    const { openModal } = useModal();

    return (
        <PageTransition>
            <div className="min-h-screen">
                {user ? (
                    <div className="container mx-auto px-6 py-8">
                        <Dashboard />
                        <div className="mt-20">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pb-6 border-b border-white/5">
                                <div>
                                    <h2 className="text-4xl font-black text-white tracking-tight">
                                        Recommended <span className="text-primary font-accent italic">For You</span>
                                    </h2>
                                    <p className="text-text-muted mt-2 text-lg font-medium opacity-80">Continue your journey with these top picks hand-picked for your path.</p>
                                </div>
                            </div>
                            <CourseList isHome={true} limit={4} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-24 pb-20">
                        {/* Hero Section */}
                        <div className="relative pt-32 pb-10 px-6">
                            <div className="container mx-auto relative z-10">
                                <div className="max-w-4xl mx-auto text-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <h1 className="hero-title text-white mb-8 tracking-tight">
                                            Code Your <br />
                                            <span className="font-accent text-primary italic">Destiny.</span>
                                        </h1>
                                        <p className="text-text-muted text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                                            The next generation of AI, Cloud, and Web Architecture begins here. Master the stack, build the future.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                            <button
                                                onClick={() => openModal('register')}
                                                className="bg-primary hover:bg-primary-dark text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2 group text-lg"
                                            >
                                                Get Started Now
                                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            <a href="#courses" className="bg-surface border border-white/5 text-white font-black py-5 px-10 rounded-2xl transition-all hover:bg-surface-light w-full sm:w-auto flex items-center justify-center gap-2 text-lg group">
                                                <PlayCircle size={20} className="text-primary" />
                                                Browse Catalog
                                            </a>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Tech Stack Icons */}
                        <div className="container mx-auto px-6">
                            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50">
                                <div className="flex flex-col items-center gap-3">
                                    <Code size={40} className="text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest">Web Core</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <Cpu size={40} className="text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest">AI & Data</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <Globe size={40} className="text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest">Infrastructure</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { icon: UsersIcon, val: "50k+", label: "Active Students" },
                                    { icon: PlayCircle, val: "200+", label: "Expert Modules" },
                                    { icon: Trophy, val: "98%", label: "Course Success" }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-surface border border-white/5 p-10 rounded-[32px] flex items-center gap-8 shadow-xl">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                            <stat.icon size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-black text-white">{stat.val}</h3>
                                            <p className="text-text-muted font-bold text-sm uppercase tracking-widest">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trending Section */}
                        <div id="courses" className="container mx-auto px-6 pb-20">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                                <div>
                                    <h2 className="text-4xl font-black text-white tracking-tight">
                                        Explore <span className="text-primary font-accent italic">Courses</span>
                                    </h2>
                                    <p className="text-text-muted mt-2 text-lg font-medium opacity-80">Master the most in-demand technical skills with our curated curriculum.</p>
                                </div>
                                <Link to="/courses" className="group flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:text-white transition-colors bg-white/5 px-6 py-3 rounded-full">
                                    View All Courses <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <CourseList isHome={true} limit={4} />
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Home;

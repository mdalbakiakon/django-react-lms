import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, Shield, UserCheck, User, ArrowRight, Clock, PlayCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('lms/dashboard/stats/');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();

        if (user?.role === 'student') {
            const fetchEnrollments = async () => {
                try {
                    const response = await api.get('lms/enrollments/');
                    setEnrolledCourses(response.data);
                } catch (error) {
                    console.error("Error fetching enrollments", error);
                }
            };
            fetchEnrollments();
        }
    }, [user]);

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4 }
        })
    };

    return (
        <div className="container mx-auto px-6 space-y-12 pb-20 pt-10">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Dashboard <span className='text-primary font-accent italic'>Overview</span>
                    </h1>
                    <p className="text-text-muted mt-1 font-medium italic">Welcome back, {user?.username}!</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-surface border border-white/5 rounded-full text-xs font-bold text-text-muted flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Last update: Just now
                    </div>
                </div>
            </div>

            {stats && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: 'Total Users', value: stats.total_users, icon: Users, color: 'primary' },
                            { label: 'Active Courses', value: stats.total_courses, icon: BookOpen, color: 'primary' },
                            { label: 'Enrollments', value: stats.total_enrollments, icon: GraduationCap, color: 'primary' }
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={itemVariants}
                                className="bg-surface border border-white/5 p-8 rounded-[32px] relative overflow-hidden group shadow-2xl shadow-black/20"
                            >
                                <div className="absolute -right-4 -top-4 opacity-5 text-primary group-hover:scale-125 transition-transform duration-700">
                                    <item.icon size={120} />
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <item.icon size={24} />
                                    </div>
                                    <TrendingUp size={20} className="text-primary/40" />
                                </div>
                                <h3 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-1">{item.label}</h3>
                                <p className="text-5xl font-black text-white">{item.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {user?.role === 'student' && enrolledCourses.length > 0 && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <PlayCircle size={28} className="text-primary" /> My Learning Path
                                </h2>
                                <Link to="/courses" className="text-primary hover:text-white transition-all font-bold text-sm">Browse catalog</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {enrolledCourses.map((enrollment, index) => (
                                    <motion.div
                                        key={enrollment.id}
                                        custom={index + 3}
                                        initial="hidden"
                                        animate="visible"
                                        variants={itemVariants}
                                        className="bg-surface-light border border-white/5 rounded-[32px] overflow-hidden flex flex-col group hover:border-primary/30 transition-all duration-300"
                                    >
                                        <div className="p-8 flex-1">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="bg-background text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/20">
                                                    {enrollment.course_detail?.category_detail?.name || 'General'}
                                                </span>
                                                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-text-muted text-xs font-bold">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{enrollment.course_title}</h3>
                                            <p className="text-text-muted text-sm mb-6 line-clamp-2 leading-relaxed">{enrollment.course_detail?.description}</p>

                                            <div className="flex items-center gap-4 text-xs text-text-muted font-bold pt-6 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-background border border-white/10 flex items-center justify-center text-primary text-[10px] overflow-hidden">
                                                        {enrollment.course_detail?.instructor_detail?.avatar ? (
                                                            <img src={enrollment.course_detail.instructor_detail.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User size={14} />
                                                        )}
                                                    </div>
                                                    <span className="truncate max-w-[100px]">
                                                        {enrollment.course_detail?.instructor_detail?.first_name ?
                                                            `${enrollment.course_detail.instructor_detail.first_name} ${enrollment.course_detail.instructor_detail.last_name || ''}` :
                                                            enrollment.course_detail?.instructor_name || 'Expert Mentor'}
                                                    </span>
                                                </div>
                                                <span className="flex items-center gap-1.5 ml-auto"><Clock size={14} className="text-primary" /> {enrollment.course_detail?.duration || '8h 12m'}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-background/50">
                                            <Link to={`/courses/${enrollment.course}`} className="flex items-center justify-center gap-2 w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-lg group">
                                                <PlayCircle size={18} className="group-hover:scale-110 transition-transform" /> Continue Learning
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div
                            custom={6}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            className="bg-surface border border-white/5 p-10 rounded-[40px]"
                        >
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <Users size={28} className="text-primary" /> User Distribution
                            </h3>
                            <div className="space-y-4">
                                {stats.role_distribution.map((roleStat, index) => (
                                    <div key={index} className="flex items-center justify-between p-5 bg-background border border-white/5 rounded-2xl hover:border-primary/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleStat.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                                                roleStat.role === 'instructor' ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-primary/10 text-primary'
                                                }`}>
                                                {roleStat.role === 'admin' && <Shield size={20} />}
                                                {roleStat.role === 'instructor' && <UserCheck size={20} />}
                                                {roleStat.role === 'student' && <User size={20} />}
                                            </div>
                                            <div>
                                                <span className="font-bold text-white capitalize text-lg block">{roleStat.role}s</span>
                                                <span className="text-text-muted text-xs font-medium">Platform Role</span>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-black text-white group-hover:text-primary transition-colors">{roleStat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            custom={7}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            className="bg-surface border border-white/5 p-10 rounded-[40px]"
                        >
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <TrendingUp size={28} className="text-primary" /> Efficiency Tools
                            </h3>
                            <div className="grid grid-cols-1 gap-5">
                                <Link to="/courses" className="flex items-center justify-between p-6 bg-primary text-white rounded-[24px] hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 group">
                                    <div className="flex items-center gap-4">
                                        <BookOpen size={24} />
                                        <span className="font-black text-lg">Catalog Manager</span>
                                    </div>
                                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                                <Link to="/profile" className="flex items-center justify-between p-6 bg-surface-light border border-white/5 text-white rounded-[24px] hover:border-primary/50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <User size={24} className="text-primary" />
                                        <span className="font-black text-lg">Account Settings</span>
                                    </div>
                                    <ArrowRight size={24} className="text-text-muted group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;

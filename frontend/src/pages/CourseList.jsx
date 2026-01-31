import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { Clock, User, ArrowRight, PlusCircle, BookOpen, Star, Code, Cpu, Layout, Brain, Terminal, Cloud, Database, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseList = ({ isHome = false, limit = null }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('lms/courses/');
                // Apply limit if provided
                const data = limit ? response.data.slice(0, limit) : response.data;
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [limit]);

    const CategoryIcon = ({ category }) => {
        const iconMap = {
            'Computer Science': Code,
            'Web Development': Layout,
            'Mobile Development': Smartphone,
            'Data Science': Brain,
            'Artificial Intelligence': Cpu,
            'Cloud Computing': Cloud,
            'Cybersecurity': Shield,
            'Blockchain': Database,
        };
        const Icon = iconMap[category] || BookOpen;
        return <Icon size={40} />;
    };

    return (
        <PageTransition>
            <div className={isHome ? "" : "container mx-auto pb-20 px-6"}>
                {!isHome && (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 pt-10">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                                Explore <span className='text-primary font-accent italic'>Courses</span>
                            </h1>
                            <p className="text-text-muted mt-2 text-lg">Pick a course that matches your interests and start learning.</p>
                        </div>

                        {(user?.role === 'instructor' || user?.role === 'admin') && (
                            <Link
                                to="/courses/new"
                                className="bg-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/20 flex items-center gap-2"
                            >
                                <PlusCircle size={20} /> Create Course
                            </Link>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-surface h-96 rounded-[32px] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-surface border border-white/5 rounded-[32px] overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-500 group shadow-2xl"
                                >
                                    <div className="h-56 relative overflow-hidden bg-background group-hover:bg-surface-light transition-colors duration-500">
                                        {/* Course Thumbnail with Gradient Fade */}
                                        {course.thumbnail && (
                                            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                                                <img
                                                    src={course.thumbnail}
                                                    alt=""
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 via-background/80 to-background to-90%"></div>
                                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,_#5A6333_0%,_transparent_70%)] z-1"></div>

                                        {/* Decorative Background Icon */}
                                        <div className="absolute -top-10 -right-10 text-primary/10 group-hover:text-primary/20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                                            {(() => {
                                                const iconMap = {
                                                    'Computer Science': <Code size={200} />,
                                                    'Web Development': <Layout size={200} />,
                                                    'Mobile Development': <Smartphone size={200} />,
                                                    'Data Science': <Brain size={200} />,
                                                    'Artificial Intelligence': <Cpu size={200} />,
                                                    'Cloud Computing': <Cloud size={200} />,
                                                    'Database': <Database size={200} />,
                                                    'Cybersecurity': <Terminal size={200} />,
                                                };
                                                return iconMap[course.category_name] || <BookOpen size={200} />;
                                            })()}
                                        </div>

                                        {/* Category & Price Overlay */}
                                        <div className="absolute top-6 left-6 z-10">
                                            <span className="bg-background/80 backdrop-blur-md text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-primary/20 shadow-lg">
                                                {course.category_name}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-6 right-6 z-10">
                                            <span className="bg-primary text-white text-xl font-black px-6 py-3 rounded-2xl shadow-2xl">
                                                ${course.price}
                                            </span>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent"></div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-1 mb-3 text-accent transition-colors">
                                            <Star size={14} fill="currentColor" />
                                            <Star size={14} fill="currentColor" />
                                            <Star size={14} fill="currentColor" />
                                            <Star size={14} fill="currentColor" />
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs text-text-muted ml-1 font-bold">(4.9)</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-white group-hover:text-primary transition-colors line-clamp-1 mb-1">{course.title}</h2>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Lead Mentor:</span>
                                            <span className="text-xs font-bold text-text-muted">
                                                {course.instructor_detail?.first_name ? `${course.instructor_detail.first_name} ${course.instructor_detail.last_name}` : course.instructor_detail?.username || 'Expert'}
                                            </span>
                                        </div>

                                        <p className="text-text-muted text-sm mb-8 line-clamp-2 leading-relaxed">{course.description}</p>

                                        <div className="mt-auto">
                                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-surface-light border border-white/10 flex items-center justify-center text-primary text-[10px] font-black overflow-hidden">
                                                        {course.instructor_detail?.avatar ? (
                                                            <img src={course.instructor_detail.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            (course.instructor_detail?.first_name || course.instructor_detail?.username || '?').charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-text-muted font-bold truncate max-w-[150px]">
                                                        {course.instructor_detail?.first_name ? `${course.instructor_detail.first_name} ${course.instructor_detail.last_name || ''}` : course.instructor_detail?.username}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-text-muted">
                                                    <Clock size={16} className="text-primary" />
                                                    <span className="text-xs font-bold">{course.duration || '8h 24m'}</span>
                                                </div>
                                            </div>

                                            <Link
                                                to={`/courses/${course.id}`}
                                                className="w-full bg-background border border-white/5 text-white font-black py-4 rounded-2xl hover:bg-primary hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg"
                                            >
                                                Start Learning
                                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-24 bg-surface border border-white/5 rounded-[40px]">
                                <div className="bg-background w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
                                    <BookOpen size={40} className="text-primary/40" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4">No content here yet</h3>
                                <p className="text-text-muted max-w-md mx-auto mb-10 text-lg">Check back later for new expert-led courses or create your own content.</p>
                                {(user?.role === 'instructor' || user?.role === 'admin') && (
                                    <Link to="/courses/new" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black hover:bg-primary-dark transition shadow-2xl shadow-primary/20">
                                        <PlusCircle size={24} /> Become an Instructor
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default CourseList;

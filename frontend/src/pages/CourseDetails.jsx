import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import ModalContext from '../context/ModalContext';
import { Calendar, User, Clock, Award, CheckCircle, ArrowLeft, Edit, Trash2, BookOpen, Layers, Star, Code, Cpu, Layout, Brain, Terminal, Cloud, Database, Smartphone } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { motion } from 'framer-motion';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { openModal } = useContext(ModalContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            const response = await api.get(`lms/courses/${id}/`);
            setCourse(response.data);
        } catch (error) {
            console.error("Failed to fetch course details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        try {
            setEnrolling(true);
            await api.post('lms/enrollments/', { course: id });
            showNotification('Enrolled successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error("Enrollment failed", error);
            showNotification('Failed to enroll. You might already be enrolled.', 'error');
        } finally {
            setEnrolling(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`lms/courses/${id}/`);
            showNotification('Course deleted successfully.', 'success');
            navigate('/courses');
        } catch (error) {
            console.error("Failed to delete course", error);
            showNotification('Failed to delete course.', 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    if (!course) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
            <div className="bg-surface p-10 rounded-full border border-white/5">
                <Layers size={64} className="text-text-muted" />
            </div>
            <h1 className="text-3xl font-black text-white">Course Not Found</h1>
            <Link to="/courses" className="button-primary">Back to Catalog</Link>
        </div>
    );

    return (
        <div className="min-h-screen pb-20">
            <div className={`container mx-auto px-6 ${!user ? 'pt-40' : 'pt-10'}`}>
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-10">
                    <Link to="/courses" className="inline-flex items-center text-text-muted hover:text-white transition-all font-bold group">
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Courses
                    </Link>

                    {(user?.role === 'admin' || user?.id === course.instructor) && (
                        <div className="flex gap-4">
                            <Link to={`/courses/${course.id}/edit`} className="p-3 bg-surface border border-white/5 rounded-xl text-primary hover:text-white transition-all hover:border-primary/50">
                                <Edit size={20} />
                            </Link>
                            <button onClick={handleDeleteClick} className="p-3 bg-surface border border-white/5 rounded-xl text-red-400 hover:text-red-500 transition-all hover:border-red-500/50">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="bg-surface border border-white/5 p-10 md:p-14 rounded-[40px] shadow-2xl overflow-hidden relative">
                            {/* Accent Blob */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative z-10"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-background text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-primary/20">
                                        {course.category_detail?.name || 'Academic'}
                                    </span>
                                    <div className="flex items-center gap-0.5 text-accent">
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-xs text-text-muted ml-1 font-bold">5.0 (2,143 ratings)</span>
                                    </div>
                                </div>

                                <h1 className="text-5xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                                    {course.title}
                                </h1>

                                <p className="text-text-muted text-xl leading-relaxed mb-10 max-w-3xl border-l-4 border-primary/20 pl-8">
                                    {course.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                                            {course.instructor_detail?.avatar ? (
                                                <img src={course.instructor_detail.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">Lead Instructor</p>
                                            <p className="text-white font-black text-lg">
                                                {course.instructor_detail?.first_name ? `${course.instructor_detail.first_name} ${course.instructor_detail.last_name || ''}` : course.instructor_detail?.username || 'Expert Mentor'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">Last Modified</p>
                                            <p className="text-white font-black text-lg">{new Date(course.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Learning Objectives */}
                        <div className="bg-surface border border-white/5 p-10 md:p-14 rounded-[40px]">
                            <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                                <BookOpen size={32} className="text-primary" /> Learning Objectives
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    "Master core foundational principles and advanced strategies",
                                    "Implement production-grade solutions using industry best practices",
                                    "Solve complex architectural challenges with systematic analysis",
                                    "Build a comprehensive portfolio of professional-grade projects"
                                ].map((objective, i) => (
                                    <div key={i} className="flex items-start gap-4 group">
                                        <div className="mt-1 flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="text-text-muted font-medium leading-relaxed">{objective}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Purchase */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
                        <div className="bg-surface border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative">
                            {/* Top Image Area */}
                            <div className="h-64 relative flex items-center justify-center overflow-hidden group bg-background">
                                {/* Course Thumbnail with Artistic Fade */}
                                {course.thumbnail && (
                                    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt=""
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 via-background/80 to-background to-90%"></div>
                                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
                                    </div>
                                )}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,_#5A6333_0%,_transparent_70%)] z-1"></div>

                                {/* Category Tag Overlay */}
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.3em] border border-white/10 shadow-xl">
                                        {course.category_detail?.name || 'Technical'}
                                    </span>
                                </div>

                                {/* Decorative Background Icon (Top Right) */}
                                <div className="absolute -top-12 -right-12 text-primary/10 group-hover:text-primary/20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                                    {(() => {
                                        const cat = course.category_detail?.name?.toLowerCase() || '';
                                        const title = course.title?.toLowerCase() || '';
                                        if (title.includes('python') || cat.includes('python')) return <Terminal size={240} strokeWidth={1} />;
                                        if (title.includes('ai') || cat.includes('ai') || title.includes('intelligence')) return <Brain size={240} strokeWidth={1} />;
                                        if (cat.includes('web') || cat.includes('code') || title.includes('javascript')) return <Code size={240} strokeWidth={1} />;
                                        if (cat.includes('cloud') || title.includes('aws')) return <Cloud size={240} strokeWidth={1} />;
                                        if (cat.includes('data') || title.includes('sql')) return <Database size={240} strokeWidth={1} />;
                                        if (cat.includes('mobile')) return <Smartphone size={240} strokeWidth={1} />;
                                        if (cat.includes('design')) return <Layout size={240} strokeWidth={1} />;
                                        return <Cpu size={240} strokeWidth={1} />;
                                    })()}
                                </div>

                                <div className="absolute inset-0 bg-black/10 transition-colors pointer-events-none"></div>
                                <div className="absolute bottom-6 right-6 bg-primary text-white font-black px-6 py-3 rounded-2xl text-2xl shadow-2xl z-20">
                                    ${course.price}
                                </div>
                            </div>

                            <div className="p-10 space-y-8">
                                {user?.role === 'student' ? (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolling || isEnrolled}
                                        className={`flex items-center justify-center gap-3 w-full py-5 rounded-[24px] font-black text-xl transition-all duration-300 shadow-xl ${isEnrolled
                                            ? 'bg-primary/20 text-primary cursor-default'
                                            : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20 hover:scale-[1.02] active:scale-95'
                                            }`}
                                    >
                                        {isEnrolled ? (
                                            <>
                                                <CheckCircle size={24} /> Enrolled
                                            </>
                                        ) : enrolling ? "Processing..." : "Secure My Seat"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => !user && openModal('login')}
                                        className={`w-full py-5 rounded-[24px] font-black text-xl transition-all duration-300 shadow-xl ${user
                                            ? 'bg-surface-light text-text-muted cursor-default border border-white/5'
                                            : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20 hover:scale-[1.02]'
                                            }`}
                                        disabled={!!user}
                                    >
                                        {user ? `Restricted for ${user.role}` : 'SignIn to Enroll'}
                                    </button>
                                )}

                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <h3 className="font-black text-white text-lg tracking-tight">Full enrollment includes:</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: Clock, label: `${course.duration || '24h 45m'} total video content` },
                                            { icon: Award, label: 'Verified certificate of completion' },
                                            { icon: Clock, label: 'Full lifetime access and updates' },
                                            { icon: Calendar, label: 'Access on mobile and desktop' }
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-4 text-text-muted font-bold text-sm">
                                                <div className="text-primary"><feat.icon size={18} /></div>
                                                {feat.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Course?"
                message="This will permanently Remove the course and all enrollment data. This action cannot be undone."
                confirmText="Permanently Delete"
                cancelText="Keep Course"
                isDestructive={true}
            />
        </div>
    );
};

export default CourseDetails;

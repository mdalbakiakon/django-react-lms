import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NotificationContext from '../context/NotificationContext';
import { BookOpen, Clock, Tag, Layout, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        duration: ''
    });
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchCourseData();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('lms/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchCourseData = async () => {
        try {
            const response = await api.get(`lms/courses/${id}/`);
            const { title, description, category, duration } = response.data;
            setFormData({ title, description, category: category || '', duration: duration || '' });
        } catch (error) {
            console.error("Failed to fetch course data", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`lms/courses/${id}/`, formData);
                showNotification('Course architected successfully!', 'success');
            } else {
                await api.post('lms/courses/', formData);
                showNotification('New course deployed!', 'success');
            }
            navigate('/courses');
        } catch (error) {
            console.error("Failed to save course", error);
            showNotification('Deployment failed. Security breach?', 'error');
        }
    };

    return (
        <div className="container mx-auto px-6 py-10 space-y-10">
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <Link to="/courses" className="inline-flex items-center text-text-muted hover:text-white transition-all font-bold group">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Catalog
                </Link>
                <div className="text-right">
                    <h1 className="text-3xl font-black text-white">{id ? 'Edit Masterclass' : 'Draft New Course'}</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-white/5 p-10 md:p-14 rounded-[40px] shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Background Icon */}
                    <div className="absolute -right-10 -top-10 opacity-5 text-primary">
                        <Layout size={240} />
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                                    <Tag size={12} className="text-primary" /> Course Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="The Art of Modern Engineering"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium placeholder-text-muted/30"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                                    <Clock size={12} className="text-primary" /> Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    placeholder="e.g. 12 Masterclasses"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium placeholder-text-muted/30"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                                    <Layout size={12} className="text-primary" /> Curated Category
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-background border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Select Domain</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                                        <Tag size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                                    <BookOpen size={12} className="text-primary" /> Extended Description
                                </label>
                                <textarea
                                    name="description"
                                    rows="6"
                                    placeholder="Outline the learning vision..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/5 rounded-[24px] px-6 py-4 text-white focus:border-primary/50 outline-none transition-all font-medium placeholder-text-muted/30 resize-none"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-10 border-t border-white/5 gap-6">
                            <p className="text-[10px] text-text-muted font-bold max-w-xs leading-relaxed italic opacity-40">
                                * Your content will be reviewed for quality assurance before public deployment to the catalog.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/courses')}
                                    className="px-8 py-4 rounded-2xl border border-white/5 text-text-muted font-bold hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-3 px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
                                >
                                    <Send size={18} />
                                    {id ? 'Synchronize Updates' : 'Publish Masterclass'}
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CourseForm;

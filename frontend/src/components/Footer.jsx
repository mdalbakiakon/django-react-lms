import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface py-16 mt-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-4xl font-black text-white mb-6 block">
                            Code <span className="text-primary font-accent italic">Station</span>
                        </Link>
                        <p className="text-text-muted text-sm leading-relaxed font-medium">
                            Providing high-quality online courses to help you achieve your career goals. Join our community of learners today.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link to="/courses" className="text-text-muted hover:text-white transition-colors text-sm font-medium">Browse Courses</Link></li>
                            <li><Link to="/dashboard" className="text-text-muted hover:text-white transition-colors text-sm font-medium">Dashboard</Link></li>
                            <li><Link to="/profile" className="text-text-muted hover:text-white transition-colors text-sm font-medium">My Profile</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Community</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-text-muted hover:text-white transition-colors text-sm font-medium">Student Stories</a></li>
                            <li><a href="#" className="text-text-muted hover:text-white transition-colors text-sm font-medium">Help Center</a></li>
                            <li><a href="#" className="text-text-muted hover:text-white transition-colors text-sm font-medium">Affiliates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            {[Twitter, Facebook, Instagram, Linkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="p-2.5 bg-background border border-white/5 rounded-xl text-text-muted hover:text-primary transition-all hover:-translate-y-1">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                            <Mail size={16} className="text-primary" />
                            support@codestation.io
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-text-muted text-sm font-medium font-accent italic">
                        &copy; {new Date().getFullYear()} <span className="text-white font-black">Code <span className='text-primary font-accent italic'>Station</span></span>. Engineering the future.
                    </p>
                    <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-text-muted">
                        <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                        <a href="#" className="hover:text-white transition-colors">Service Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

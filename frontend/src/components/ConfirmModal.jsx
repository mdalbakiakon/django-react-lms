import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.2, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.15, ease: "easeIn" }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        className="bg-surface p-8 rounded-[32px] w-full max-w-sm relative shadow-2xl border border-white/5 overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDestructive ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}`}>
                                <AlertTriangle size={28} />
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-black text-white mb-3">{title}</h3>
                            <p className="text-text-muted font-medium mb-8 leading-relaxed">
                                {message}
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3 w-full">
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`w-full py-4 rounded-xl font-black text-sm text-white shadow-xl transition-all transform active:scale-95 ${isDestructive
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/10'
                                        : 'bg-primary hover:bg-primary-dark shadow-primary/10'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-xl font-black text-sm text-text-muted hover:text-white bg-white/5 transition-colors border border-white/5"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;

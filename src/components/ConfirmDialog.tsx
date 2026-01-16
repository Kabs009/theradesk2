import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl p-8 animate-in zoom-in-95 duration-200 border border-white/20">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg border-2 border-white ${isDestructive ? 'bg-rose-50 text-rose-500 shadow-rose-100' : 'bg-indigo-50 text-indigo-500 shadow-indigo-100'}`}>
                    <i className={`fas ${isDestructive ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">{message}</p>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-3 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 ${isDestructive
                                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;

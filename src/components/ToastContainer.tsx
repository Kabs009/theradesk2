import React from 'react';
import { useToast, ToastType } from '../contexts/ToastContext';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            pointer-events-auto
            min-w-[300px] max-w-md p-4 rounded-2xl shadow-2xl border
            flex items-start gap-3
            animate-in slide-in-from-right-full duration-300 fade-out-80 fill-mode-forwards
            ${getToastStyles(toast.type)}
          `}
                    role="alert"
                >
                    <div className={`mt-0.5 ${getIconColor(toast.type)}`}>
                        <i className={`fas ${getIconClass(toast.type)}`}></i>
                    </div>
                    <div className="flex-1">
                        <h4 className={`text-sm font-bold ${getTitleColor(toast.type)}`}>
                            {getToastTitle(toast.type)}
                        </h4>
                        <p className="text-xs font-medium opacity-90 mt-0.5 text-slate-600">
                            {toast.message}
                        </p>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            ))}
        </div>
    );
};

const getToastStyles = (type: ToastType) => {
    switch (type) {
        case 'success':
            return 'bg-white border-emerald-100 shadow-emerald-100/50';
        case 'error':
            return 'bg-white border-rose-100 shadow-rose-100/50';
        case 'warning':
            return 'bg-white border-amber-100 shadow-amber-100/50';
        case 'info':
        default:
            return 'bg-white border-indigo-100 shadow-indigo-100/50';
    }
};

const getIconColor = (type: ToastType) => {
    switch (type) {
        case 'success': return 'text-emerald-500';
        case 'error': return 'text-rose-500';
        case 'warning': return 'text-amber-500';
        case 'info': default: return 'text-indigo-500';
    }
};

const getTitleColor = (type: ToastType) => {
    switch (type) {
        case 'success': return 'text-emerald-900';
        case 'error': return 'text-rose-900';
        case 'warning': return 'text-amber-900';
        case 'info': default: return 'text-indigo-900';
    }
};

const getIconClass = (type: ToastType) => {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-circle-exclamation';
        case 'warning': return 'fa-triangle-exclamation';
        case 'info': default: return 'fa-info-circle';
    }
};

const getToastTitle = (type: ToastType) => {
    switch (type) {
        case 'success': return 'Success';
        case 'error': return 'Error';
        case 'warning': return 'Attention';
        case 'info': default: return 'Information';
    }
};

export default ToastContainer;

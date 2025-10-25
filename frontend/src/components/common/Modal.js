import React from 'react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    backdrop = true,
    keyboard = true
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (backdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (keyboard && e.key === 'Escape') {
            onClose();
        }
    };

    React.useEffect(() => {
        if (isOpen && keyboard) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, keyboard]);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    const sizeClasses = {
        sm: 'modal-sm',
        md: '',
        lg: 'modal-lg',
        xl: 'modal-xl'
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleBackdropClick}
        >
            <div className={`modal-dialog modal-dialog-centered ${sizeClasses[size]}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        {showCloseButton && (
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        )}
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;

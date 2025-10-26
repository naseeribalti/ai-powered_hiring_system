import React from 'react';

export default function Input({ label, hint, error, className, ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}
            <input className="form-control" {...props} />
            {hint && !error && (
                <div className="form-text">{hint}</div>
            )}
            {error && (
                <div className="text-danger" style={{ fontSize: '0.85rem' }}>{error}</div>
            )}
        </div>
    );
}

import React from 'react';

export default function Select({ label, options = [], hint, error, className, ...props }) {
    return (
        <div className={className}>
            {label && <label className="form-label">{label}</label>}
            <select className="form-select" {...props}>
                {options.map(opt => (
                    <option key={opt.value ?? opt} value={opt.value ?? opt}>
                        {opt.label ?? opt}
                    </option>
                ))}
            </select>
            {hint && !error && <div className="form-text">{hint}</div>}
            {error && <div className="text-danger" style={{ fontSize: '0.85rem' }}>{error}</div>}
        </div>
    );
}

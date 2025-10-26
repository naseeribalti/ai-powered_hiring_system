import React from 'react';

export default function EmptyState({ icon, title, subtitle, action }) {
    return (
        <div className="text-center py-5 u-card" style={{ background: 'var(--color-surface)' }}>
            {icon && <div className="mb-3" style={{ fontSize: 36, color: 'var(--color-muted)' }}>{icon}</div>}
            {title && <h4 className="mb-2">{title}</h4>}
            {subtitle && <p className="text-muted mb-3">{subtitle}</p>}
            {action}
        </div>
    );
}

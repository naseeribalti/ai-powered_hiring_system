import React from 'react';
import './Badge.css';

const Badge = ({
    children,
    variant = 'primary',
    size = 'medium',
    pill = false,
    dot = false,
    count = null,
    className = ''
}) => {
    const badgeClasses = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        pill && 'badge-pill',
        dot && 'badge-dot',
        className
    ].filter(Boolean).join(' ');

    if (count !== null && count > 0) {
        return (
            <span className={`${badgeClasses} badge-count`}>
                {count > 99 ? '99+' : count}
            </span>
        );
    }

    if (dot) {
        return <span className={badgeClasses}></span>;
    }

    return (
        <span className={badgeClasses}>
            {children}
        </span>
    );
};

export default Badge;

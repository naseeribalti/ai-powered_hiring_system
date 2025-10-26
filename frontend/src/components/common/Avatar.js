import React from 'react';
import './Avatar.css';

const Avatar = ({
    src = null,
    alt = '',
    fallback = null,
    size = 'medium',
    shape = 'circle',
    status = null,
    statusPosition = 'bottom-right',
    online = false,
    className = '',
    onClick = null
}) => {
    const avatarClasses = [
        'avatar',
        `avatar-${size}`,
        `avatar-${shape}`,
        onClick && 'avatar-clickable',
        className
    ].filter(Boolean).join(' ');

    const statusClasses = [
        'avatar-status',
        `avatar-status-${statusPosition}`,
        online && 'avatar-status-online',
        status && `avatar-status-${status}`
    ].filter(Boolean).join(' ');

    const renderContent = () => {
        if (src) {
            return <img src={src} alt={alt} className="avatar-image" />;
        }

        if (fallback) {
            return <span className="avatar-fallback">{fallback}</span>;
        }

        const initials = alt ? alt.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : '?';
        return <span className="avatar-fallback">{initials}</span>;
    };

    return (
        <div className={avatarClasses} onClick={onClick}>
            {renderContent()}
            {(status || online) && <span className={statusClasses}></span>}
        </div>
    );
};

export default Avatar;

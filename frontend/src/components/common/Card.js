import React from 'react';
import './Card.css';

const Card = ({
    children,
    variant = 'default',
    hoverable = false,
    className = '',
    onClick,
    header,
    footer,
    image,
    ...props
}) => {
    const cardClasses = [
        'card',
        `card-${variant}`,
        hoverable && 'card-hoverable',
        onClick && 'card-clickable',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClasses} onClick={onClick} {...props}>
            {image && (
                <div className="card-image">
                    <img src={image} alt="" />
                </div>
            )}
            {header && (
                <div className="card-header">
                    {header}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;

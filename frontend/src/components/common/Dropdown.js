import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({
    trigger,
    items = [],
    position = 'bottom-left',
    className = '',
    onSelect = null
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick();
        }
        if (onSelect) {
            onSelect(item);
        }
        if (!item.keepOpen) {
            setIsOpen(false);
        }
    };

    const dropdownClasses = [
        'dropdown',
        isOpen && 'dropdown-open',
        className
    ].filter(Boolean).join(' ');

    const menuClasses = [
        'dropdown-menu',
        `dropdown-menu-${position}`,
        isOpen && 'dropdown-menu-show'
    ].filter(Boolean).join(' ');

    return (
        <div className={dropdownClasses} ref={dropdownRef}>
            <div
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {trigger}
            </div>
            {isOpen && (
                <div className={menuClasses}>
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.divider ? (
                                <div className="dropdown-divider"></div>
                            ) : (
                                <div
                                    className={`dropdown-item ${item.className || ''} ${item.disabled ? 'dropdown-item-disabled' : ''}`}
                                    onClick={() => !item.disabled && handleItemClick(item)}
                                >
                                    {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
                                    <span className="dropdown-item-label">{item.label}</span>
                                    {item.badge && (
                                        <span className="dropdown-item-badge">{item.badge}</span>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;

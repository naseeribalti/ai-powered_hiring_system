import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const options = [
        { key: 'light', label: 'Light', icon: 'fas fa-sun' },
        { key: 'dark', label: 'Dark', icon: 'fas fa-moon' },
        { key: 'system', label: 'System', icon: 'fas fa-desktop' },
    ];

    return (
        <div className="nav-theme-toggle" role="group" aria-label="Theme selector">
            {options.map(opt => (
                <button
                    key={opt.key}
                    type="button"
                    className={`theme-btn ${theme === opt.key ? 'active' : ''}`}
                    title={`${opt.label} theme`}
                    onClick={() => setTheme(opt.key)}
                    aria-pressed={theme === opt.key}
                    aria-label={opt.label}
                >
                    <i className={opt.icon}></i>
                </button>
            ))}
            <span className="visually-hidden">Current theme: {resolvedTheme}</span>
        </div>
    );
};

export default ThemeToggle;

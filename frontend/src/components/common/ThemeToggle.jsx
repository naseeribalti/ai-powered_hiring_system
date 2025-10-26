import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const options = [
        { key: 'light', label: 'Light', icon: 'far fa-sun' },
        { key: 'dark', label: 'Dark', icon: 'far fa-moon' },
        { key: 'system', label: 'System', icon: 'fas fa-desktop' },
    ];

    return (
        <div className="btn-group" role="group" aria-label="Theme selector">
            {options.map(opt => (
                <button
                    key={opt.key}
                    type="button"
                    className={`btn btn-sm ${theme === opt.key ? 'btn-light' : 'btn-outline-light'}`}
                    title={`${opt.label} theme`}
                    onClick={() => setTheme(opt.key)}
                    aria-pressed={theme === opt.key}
                >
                    <i className={`${opt.icon} me-1`}></i>
                    <span className="d-none d-md-inline">{opt.label}</span>
                </button>
            ))}
            <span className="visually-hidden">Current: {resolvedTheme}</span>
        </div>
    );
};

export default ThemeToggle;

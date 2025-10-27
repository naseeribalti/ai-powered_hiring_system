import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();

    // Toggle between light and dark only
    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    // Show sun icon in dark mode (click to go light), moon in light mode (click to go dark)
    const icon = resolvedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    const label = resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            type="button"
            className="theme-toggle-btn"
            title={label}
            onClick={toggleTheme}
            aria-label={label}
        >
            <i className={icon}></i>
        </button>
    );
};

export default ThemeToggle;

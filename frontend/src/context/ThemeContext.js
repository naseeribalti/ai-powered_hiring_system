import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'system', setTheme: () => { }, resolvedTheme: 'light' });

const getSystemPref = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        try {
            return localStorage.getItem('theme') || 'system';
        } catch {
            return 'system';
        }
    });

    const [resolvedTheme, setResolvedTheme] = useState('light');

    const applyTheme = (t) => {
        const root = document.documentElement;
        root.setAttribute('data-theme', t);
        const actual = t === 'system' ? getSystemPref() : t;
        setResolvedTheme(actual);
        // Hint the browser for form controls
        root.style.colorScheme = actual;
    };

    useEffect(() => {
        applyTheme(theme);
        try {
            localStorage.setItem('theme', theme);
        } catch { }
    }, [theme]);

    useEffect(() => {
        if (theme !== 'system') return;
        const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => applyTheme('system');
        if (mql?.addEventListener) mql.addEventListener('change', handler);
        else if (mql?.addListener) mql.addListener(handler);
        return () => {
            if (mql?.removeEventListener) mql.removeEventListener('change', handler);
            else if (mql?.removeListener) mql.removeListener(handler);
        };
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme: setThemeState, resolvedTheme }), [theme, resolvedTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

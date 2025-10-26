import { useEffect } from 'react';

const ensureSvgFaviconLink = () => {
    let link = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'icon');
        link.setAttribute('type', 'image/svg+xml');
        document.head.appendChild(link);
    }
    return link;
};

const FaviconManager = () => {
    useEffect(() => {
        const updateFavicon = () => {
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const link = ensureSvgFaviconLink();
            if (link) {
                link.href = isDark ? '/favicon-dark.svg' : '/favicon.svg';
            }
        };

        // Initial update
        updateFavicon();

        // Listen for theme changes
        const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        if (mql && mql.addEventListener) {
            mql.addEventListener('change', updateFavicon);
        } else if (mql && mql.addListener) {
            // Safari/older browsers
            mql.addListener(updateFavicon);
        }

        return () => {
            if (mql && mql.removeEventListener) {
                mql.removeEventListener('change', updateFavicon);
            } else if (mql && mql.removeListener) {
                mql.removeListener(updateFavicon);
            }
        };
    }, []);

    return null;
};

export default FaviconManager;

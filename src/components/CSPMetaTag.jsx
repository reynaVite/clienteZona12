import React, { useEffect } from 'react';

export function CSPMetaTag() {
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';

        meta.content = `
            default-src 'self';
            script-src 'self' https://apis.google.com https://www.gstatic.com https://www.google.com https://cdn.jsdelivr.net;
            style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net/npm/antd@5.11.3/dist/antd.css;
            font-src 'self' https://cdn.jsdelivr.net/npm/antd@5.11.3/dist/fonts/;
            img-src 'self'; 
            connect-src 'self' http://localhost:3000 https://www.google-analytics.com https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188;
            frame-src 'self' https://www.google.com;
            form-action 'self';
        `;

        document.head.appendChild(meta);

        return () => {
            document.head.removeChild(meta);
        };
    }, []);

    return null;
}

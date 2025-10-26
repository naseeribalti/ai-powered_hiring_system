import React from 'react';

export default function Skeleton({ height = 12, width = '100%', className, style }) {
    return (
        <div
            className={`skeleton ${className || ''}`}
            style={{ height, width, ...style }}
        />
    );
}

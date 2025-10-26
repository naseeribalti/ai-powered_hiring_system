import React from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Button
 * - Variants: primary, outline, ghost
 * - Sizes: sm, md, lg
 */
export default function Button({
    as: As = 'button',
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}) {
    const base = 'btn';
    const variantClass =
        variant === 'primary' ? 'btn-primary' :
            variant === 'outline' ? 'btn btn-outline-primary' :
                'btn';
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

    return (
        <As className={cx(base, variantClass, sizeClass, className)} {...props}>
            {children}
        </As>
    );
}

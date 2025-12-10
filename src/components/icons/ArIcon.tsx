import type { SVGProps } from 'react';

export const ArIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M5 12s2.545-5 7-5c4.455 0 7 5 7 5s-2.545 5-7 5c-4.455 0-7-5-7-5z" />
        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        <path d="M20.57 16.22a2 2 0 0 0-2.39-2.39" />
        <path d="M3.43 16.22a2 2 0 0 1 2.39-2.39" />
        <path d="M3.43 7.78a2 2 0 0 0 2.39 2.39" />
        <path d="M20.57 7.78a2 2 0 0 1-2.39 2.39" />
    </svg>
);

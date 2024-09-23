/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "text-primary": "#060F2E",
                "highlight-dark": "#C80036",
                "highlight-light": "#FF6969",
                "highlight-secondary": "#FAFAFA",
                "background-light": "#F6F5F4",
                "background-dark": "#8896AB",
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [],
};

/**
 * old colors
 * text-primary: "#0C1844"
 * background-light: "#F5F4F2"
 */

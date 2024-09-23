import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll to top component
 * Use in Router child to scroll to top when window location changes
 * @returns null
 */
export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
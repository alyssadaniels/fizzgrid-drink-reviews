import { Link } from "react-router-dom";

interface InternalLinkProps {
    text: string;
    to: string;
    invertTextColor?: boolean;
}

/**
 * Styled link for internal links
 * @param text text to display
 * @param to url to navigate to
 * @param invertTextColor true: make text color light, false: make text color dark
 * @returns InternalLink component
 */
function InternalLink({
    text,
    to,
    invertTextColor = false,
}: InternalLinkProps) {
    return (
        <Link
            className={`underline hover:text-highlight-light ${
                invertTextColor
                    ? "text-highlight-secondary"
                    : "text-background-dark"
            }`}
            to={to}
        >
            {text}
        </Link>
    );
}

export default InternalLink;

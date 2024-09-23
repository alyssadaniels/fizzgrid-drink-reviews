import { Link } from "react-router-dom";
import { ChildrenProps } from "../../../util/types";

interface HorizontalCardProps extends ChildrenProps {
    url: string;
}

/**
 * Card formatting component
 * Items are aligned left by default, uses 12-column grid
 * @param url url to direct to on click
 * @param children card children/content
 * @returns HorizontalCard component
 */
function HorizontalCard({ url, children }: HorizontalCardProps) {
    return (
        <Link
            className={`grid grid-cols-12 gap-4 px-20 py-8 drop-shadow-md bg-highlight-secondary text-text-primary hover:bg-background-light`}
            to={url}
        >
            {children}
        </Link>
    );
}

export default HorizontalCard;

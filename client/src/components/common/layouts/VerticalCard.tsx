import { Link } from "react-router-dom";
import { ChildrenProps } from "../../../util/types";

interface VerticalCardProps extends ChildrenProps {
    url: string;
}

/**
 * Card formatting component
 * Items are aligned center by default
 * @param url url to direct to on click
 * @param children card children/content
 * @returns VerticalCard component
 */
function VerticalCard({ url, children }: VerticalCardProps) {
    return (
        <Link
            className="flex flex-col items-center text-center gap-3 px-10 py-8 drop-shadow-md bg-highlight-secondary text-text-primary hover:bg-background-light"
            to={url}
        >
            {children}
        </Link>
    );
}

export default VerticalCard;

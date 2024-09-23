import { StarIcon } from "./icons";

interface StarRatingDisplayProps {
    numStars: number;
    iconSize: string;
}

/**
 * Star rating display component - displays a star rating
 * @param numStars number of stars to highlight, rating
 * @param iconSize size of star icons
 * @returns StarRatingDisplay component
 */
function StarRatingDisplay(props: StarRatingDisplayProps) {
    const stars = [];

    // set star colors
    for (let i = 0; i < 5; i++) {
        const star = (
            <div
                key={i}
                className={
                    props.numStars > i
                        ? "text-highlight-light"
                        : "text-background-dark"
                }
            >
                <StarIcon size={props.iconSize} />
            </div>
        );

        stars.push(star);
    }

    return (
        <div className="flex">
            {stars.map((star) => {
                return star;
            })}
        </div>
    );
}

export default StarRatingDisplay;

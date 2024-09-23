import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WriteIcon } from "../../common/icons";

/**
 * Write review link component - displays link for writing a review
 * Clicking this component will redirect the user to the write a review page
 * @returns WriteReviewButton component
 */
function WriteReviewButton() {
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();

    return (
        <button
            className="my-auto hover:text-highlight-light"
            onClick={(event) => {
                event.preventDefault();
                navigate(`/write-review`);
            }}
            onMouseEnter={() => {
                setShowTooltip(true);
            }}
            onMouseLeave={() => {
                setShowTooltip(false);
            }}
        >
            {/* icon */}
            <WriteIcon />

            {/* tooltip */}
            {showTooltip && (
                <div
                    role="tooltip"
                    className="absolute text-background-light bg-text-primary text-xs px-2 py-1"
                >
                    Write a review
                </div>
            )}
        </button>
    );
}

export default WriteReviewButton;

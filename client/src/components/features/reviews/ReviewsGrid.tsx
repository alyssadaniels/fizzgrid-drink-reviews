import MasonGridContainer from "../../common/layouts/MasonGridContainer";
import VerticalReviewCard from "./VerticalReviewCard";

/**
 * Reviews container for given reviews
 * @param reviewIDs reviews to display
 * @returns ReviewsContainer component
 */
function ReviewsGrid({ reviewIDs }: { reviewIDs: number[] }) {
    if (reviewIDs.length === 0) {
        return <p className="text-background-dark">No reviews yet</p>;
    }

    return (
        <MasonGridContainer>
            {reviewIDs.map((id) => (
                <div key={id} className="max-w-96">
                    <VerticalReviewCard reviewId={id} />
                </div>
            ))}
        </MasonGridContainer>
    );
}

export default ReviewsGrid;

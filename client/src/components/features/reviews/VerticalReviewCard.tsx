import VerticalCard from "../../common/layouts/VerticalCard";
import ProfilePicture from "../profiles/ProfilePicture";
import StarRatingDisplay from "../../common/StarRatingDisplay";
import { SM_ICON_SIZE } from "../../../util/constants";
import ReviewLikes from "./ReviewLikes";
import { CommentsIcon, LoadingCircle } from "../../common/icons";
import ItemCount from "../../common/ui/ItemCount";
import { useFetchComments, useFetchReview } from "../../../api-hooks/gets/reviewHooks";

/**
 * Review card displays review info
 * Clicking on component will direct user to review page
 * @param reviewData data for review
 * @returns Review card component
 */
function VerticalReviewCard({ reviewId }: { reviewId: number }) {
    const {
        data: reviewData,
        isLoading,
        isRefetching,
    } = useFetchReview(reviewId);

    const { data: commentData } = useFetchComments(reviewId);

    if (isLoading) {
        return (
            <div className="mx-auto w-fit">
                <LoadingCircle />
            </div>
        );
    }

    if (!reviewData || !commentData) {
        return <></>;
    }


    return (
        <VerticalCard url={`/reviews/${reviewData.review.id}`}>
            {/* header */}
            <div className="grid grid-cols-6 justify-evenly gap-4 p-2">
                {/* profile pic */}
                <div className="w-10 h-10">
                    <ProfilePicture imageURL={reviewData.profile.profile_img} />
                </div>

                {/* name and stars */}
                <div className="col-span-3">
                    <p className="font-bold break-all text-left">{reviewData.profile.username}</p>
                    <StarRatingDisplay
                        numStars={reviewData.review.rating}
                        iconSize={SM_ICON_SIZE}
                    />
                </div>

                {/* likes */}
                <ReviewLikes
                    reviewData={reviewData}
                    isRefetching={isRefetching || isLoading}
                />

                {/* comments */}
                <ItemCount n={commentData.length} icon={<CommentsIcon />} />
            </div>
            {/* image */}
            {reviewData.images.length > 0 && (
                <img
                    className="object-cover w-full h-44"
                    src={reviewData.images[0].image}
                    alt={reviewData.images[0].label}
                />
            )}

            <div className="px-6 py-4 w-full">
                {/* drink info */}
                <h2 className="font-bold text-xl my-1">
                    {reviewData.drink.product_name}
                </h2>
                <p className="text-background-dark text-xs">
                    {reviewData.drink.brand_name}
                </p>

                {/* review text */}
                <p className="line-clamp-4 break-words my-2 text-sm">
                    {reviewData.review.review_text}
                </p>
            </div>
        </VerticalCard>
    );
}

export default VerticalReviewCard;

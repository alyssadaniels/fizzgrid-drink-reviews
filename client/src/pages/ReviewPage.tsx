import { Link, useNavigate, useParams } from "react-router-dom";
import PageContainer from "../components/common/layouts/PageContainer";
import TextButton from "../components/common/ui/TextButton";
import CommentsContainer from "../components/features/reviews/comments/CommentsContainer";
import WriteComment from "../components/features/reviews/comments/WriteComment";
import InternalLink from "../components/common/ui/InternalLink";
import VerticalDrinkCard from "../components/features/drinks/VerticalDrinkCard";
import StarRatingDisplay from "../components/common/StarRatingDisplay";
import { SM_ICON_SIZE } from "../util/constants";
import { LoadingCircle } from "../components/common/icons";
import VerticalProfileCard from "../components/features/profiles/VerticalProfileCard";
import { useEffect } from "react";
import ReviewLikes from "../components/features/reviews/ReviewLikes";
import { useFetchComments, useFetchReview } from "../api-hooks/gets/reviewHooks";
import { useDeleteReview } from "../api-hooks/actions/useDeleteReview";
import { useUser } from "../api-hooks/actions/useUser";

/**
 * Review page - displays info for a single review
 * @returns Review page component
 */
function ReviewPage() {
    const { slug } = useParams();
    const reviewID = parseInt(slug ? slug : "");

    const navigate = useNavigate();

    const { data: review, isLoading, isRefetching } = useFetchReview(reviewID);
    const { data: comments } = useFetchComments(reviewID);
    const { deleteReview, isSuccess: deleteSuccess } =
        useDeleteReview(reviewID);
    const { user } = useUser();

    useEffect(() => {
        if (deleteSuccess) {
            navigate(`/users/${user?.id}`);
        }
    }, [deleteSuccess]);

    return (
        <PageContainer>
            {isLoading ? (
                <div className="w-fit mx-auto">
                    <LoadingCircle />
                </div>
            ) : review ? (
                <div className="grid grid-cols-1 gap-6 divide-y lg:gap-0 lg:divide-y-0 lg:grid-cols-5">
                    {/* review */}
                    <div className="col-span-3 lg:pl-6 lg:my-0 lg:order-last">
                        <div className="flex flex-col items-start gap-3">
                            {/* review info */}
                            <div className="flex gap-x-4">
                                <h1 className="text-lg">
                                    <Link
                                        className="font-bold hover:underline"
                                        to={`/drinks/${review.drink.id}`}
                                        target="_blank"
                                    >
                                        {review.drink.product_name}
                                    </Link>{" "}
                                    reviewed by{" "}
                                    <Link
                                        className="font-bold hover:underline"
                                        to={`/profiles/${review.profile.username}`}
                                        target="_blank"
                                    >
                                        {review.profile.username}
                                    </Link>
                                </h1>

                                <ReviewLikes
                                    reviewData={review}
                                    isRefetching={isRefetching || isLoading}
                                />
                            </div>

                            <p className="text-background-dark">
                                {review.review.date_created.toDateString()}
                            </p>

                            <div className="flex items-center gap-2">
                                <StarRatingDisplay
                                    numStars={review.review.rating}
                                    iconSize={SM_ICON_SIZE}
                                />
                                {review.review.rating === 1 ? (
                                    <p>{review.review.rating} star</p>
                                ) : (
                                    <p>{review.review.rating} stars</p>
                                )}
                            </div>

                            {/* review */}
                            <p>{review.review.review_text}</p>

                            {/* image (if exists) */}
                            {review.images.length > 0 && (
                                <img
                                    className="max-h-96 object-contain"
                                    src={review.images[0].image}
                                />
                            )}
                        </div>
                        {/* show delete if author is logged in */}
                        {user && user.id === review.profile.id && (
                            <div className="my-3 text-xs text-right">
                                <TextButton
                                    text="Delete this review"
                                    onClick={() => {
                                        const confirmation = confirm(
                                            `Delete your review for ${review.drink.product_name} - ${review.drink.brand_name}? This action is permanent and can not be undone.`
                                        );

                                        if (confirmation) {
                                            deleteReview();
                                        }
                                    }}
                                    isPrimary={false}
                                />
                            </div>
                        )}

                        <br />

                        {/* comments */}
                        {comments && (
                            <>
                                <p className="my-4 font-bold text-xl">
                                    Comments
                                </p>
                                <WriteComment reviewID={review.review.id} />
                                <div className="border-t-2 my-2"></div>
                                <CommentsContainer comments={comments} />
                            </>
                        )}
                    </div>
                    <div className="col-span-2 flex flex-col gap-10 pt-10 lg:pr-6 lg:y-0 lg:order-first">
                        {/* drink info */}
                        <VerticalDrinkCard drinkID={review.drink.id} />

                        {/* user info */}
                        <VerticalProfileCard profileID={review.profile.id} />
                    </div>
                </div>
            ) : (
                <p>
                    Review not found.{" "}
                    <InternalLink text="Explore all reviews" to="/explore" />
                </p>
            )}
        </PageContainer>
    );
}

export default ReviewPage;

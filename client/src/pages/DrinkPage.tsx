import { useParams } from "react-router-dom";
import PageContainer from "../components/common/layouts/PageContainer";
import InternalLink from "../components/common/ui/InternalLink";
import { LoadingCircle } from "../components/common/icons";
import DrinkImageCarousel from "../components/features/drinks/DrinkImageCarousel";
import { SM_ICON_SIZE } from "../util/constants";
import StarRatingDisplay from "../components/common/StarRatingDisplay";
import { getArrAvg } from "../util/functions";
import ReviewsGrid from "../components/features/reviews/ReviewsGrid";
import FavoriteButton from "../components/features/drinks/FavoriteButton";
import WriteReviewButton from "../components/features/drinks/WriteReviewButton";
import { useFetchDrink } from "../api-hooks/gets/drinkHooks";

/**
 * Drink page - displays info for a single drink
 * @returns Drink page component
 */
function DrinkPage() {
    const { slug } = useParams();

    // TODO better handling of undefined slug ?
    const drinkID = parseInt(slug ? slug : "");

    const { data, isLoading, isError, isRefetching } = useFetchDrink(drinkID);

    return (
        <>
            <PageContainer>
                {isError ? (
                    <p>
                        Drink not found.{" "}
                        <InternalLink text="Explore all drinks" to="/drinks" />
                    </p>
                ) : isLoading ? (
                    <div className="mx-auto w-fit">
                        <LoadingCircle />
                    </div>
                ) : (
                    data && (
                        <div className="w-full flex flex-col items-center divide-y-2 gap-10">
                            <div className="flex flex-col gap-4 items-center">
                                {/* drink images */}
                                {data.images && (
                                    <div className="w-fit mx-auto">
                                        <DrinkImageCarousel
                                            images={data.images}
                                        />
                                    </div>
                                )}

                                {/* drink interactions */}
                                <div className="flex gap-4 justify-center">
                                    {/* add/remove from favorites */}
                                    <FavoriteButton
                                        drinkData={data}
                                        isRefetching={isRefetching}
                                    />

                                    {/* write review */}
                                    <WriteReviewButton />
                                </div>

                                {/* drink info */}
                                <h2 className="text-2xl font-bold">
                                    {data.drink.product_name}
                                </h2>

                                <p className="text-background-dark">
                                    {data.drink.brand_name}
                                </p>

                                {data.reviews && (
                                    <div className="flex gap-2">
                                        <StarRatingDisplay
                                            numStars={getArrAvg(
                                                data.reviews.reviews,
                                                "rating"
                                            )}
                                            iconSize={SM_ICON_SIZE}
                                        />
                                        <p>{data.reviews.reviews.length} Reviews</p>
                                    </div>
                                )}
                            </div>

                            {/* drink interactions */}

                            {/* reviews */}
                            <div className="w-full flex flex-col items-center">
                                <br />
                                {data.reviews.reviews.length != 0 ? (
                                    <ReviewsGrid
                                        reviewIDs={data.reviews.reviews.map(
                                            (review) => review.id
                                        )}
                                    />
                                ) : (
                                    <p className="text-background-dark">
                                        No reviews yet.{" "}
                                        <InternalLink
                                            text="Be the first"
                                            to="/write-review"
                                        />
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                )}
            </PageContainer>
        </>
    );
}

export default DrinkPage;

import { useState } from "react";
import StarRatingDisplay from "../../common/StarRatingDisplay";
import { SM_ICON_SIZE } from "../../../util/constants";
import HorizontalCard from "../../common/layouts/HorizontalCard";
import { getArrAvg } from "../../../util/functions";
import ImagePlaceholder from "../../common/ImagePlaceholder";
import FavoriteButton from "./FavoriteButton";
import WriteReviewButton from "./WriteReviewButton";
import { LoadingCircle } from "../../common/icons";
import { useFetchDrink } from "../../../api-hooks/gets/drinkHooks";

/**
 * Drink card component - displays drink stats
 * Clicking on this component will take the user to a details page for the drink
 * @param drinkID id of drink
 * @returns DrinkCard component
 */
function HorizontalDrinkCard({ drinkID }: { drinkID: number }) {
    const [showPlaceholder, setShowPlaceholder] = useState(false);
    const { data, isRefetching, isLoading } = useFetchDrink(drinkID);

    if (isLoading) {
        return (
            <div className="mx-auto w-fit">
                <LoadingCircle />
            </div>
        );
    }

    if (!data) {
        return <></>;
    }

    return (
        <HorizontalCard url={`/drinks/${data.drink.id}`}>
            {/* image */}
            <div className="col-span-2 h-40 flex flex-col justify-center">
                {showPlaceholder || data.images.length === 0 ? (
                    <ImagePlaceholder />
                ) : (
                    <img
                        className="h-40 object-contain"
                        src={data.images[0].image}
                        onError={() => {
                            setShowPlaceholder(true);
                        }}
                    />
                )}
            </div>
            {/* info */}
            <div className="flex justify-center flex-col gap-2 col-span-8">
                <h2 className="text-xl font-bold">{data.drink.product_name}</h2>

                <p className="text-sm text-background-dark">
                    {data.drink.brand_name}
                </p>

                <div className="flex items-center gap-2">
                    <StarRatingDisplay
                        numStars={getArrAvg(data.reviews.reviews, "rating")}
                        iconSize={SM_ICON_SIZE}
                    />
                    <p className="text-xs">{data.reviews.reviews.length} reviews</p>
                </div>
            </div>
            {/* buttons */}
            <div className="flex gap-4 justify-center">
                {/* add/remove from favorites */}
                <FavoriteButton drinkData={data} isRefetching={isRefetching} />

                {/* write review */}
                <WriteReviewButton />
            </div>
        </HorizontalCard>
    );
}

export default HorizontalDrinkCard;

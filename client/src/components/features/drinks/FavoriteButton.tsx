import { useContext, useState } from "react";
import { StarIcon } from "../../common/icons";
import { DrinkData } from "../../../util/types";
import { ModalContext } from "../../../util/contexts";
import { useUser } from "../../../api-hooks/actions/useUser";
import { useSetDrinkFavorite } from "../../../api-hooks/actions/useSetDrinkFavorite";
import useOptimisticToggle from "../../../util/useOptimisticToggle";

/**
 * Favorite button - displays add/remove from favorite button
 * Clicking on this button will toggle isInFavorites
 * @param drinkData data for parent drink
 * @param isRefetching is refetching for parent drink
 * @returns Favorite toggle button
 */
function FavoriteButton({
    drinkData,
    isRefetching,
}: {
    drinkData: DrinkData;
    isRefetching: boolean;
}) {
    const [showTooltip, setShowTooltip] = useState(false);
    const { user } = useUser();
    const { setFavorite, isPending } = useSetDrinkFavorite(drinkData.drink.id);
    const [toggleVal, toggle] = useOptimisticToggle({
        toggleFunction: setFavorite,
        getIsPending: () => {
            return isPending || isRefetching;
        },
        getValue: () => {
            return (
                !!user &&
                drinkData.favorites
                    .map((favorite) => favorite.profile_id)
                    .includes(user.id)
            );
        },
    });

    const modalContext = useContext(ModalContext);
    return (
        <button
            className="my-auto hover:text-highlight-light"
            onMouseEnter={() => {
                setShowTooltip(true);
            }}
            onMouseLeave={() => {
                setShowTooltip(false);
            }}
            onClick={(event) => {
                event.preventDefault();
                if (!user) {
                    modalContext.setShowLoginModal(true);
                }

                toggle();
            }}
        >
            <div
                className={
                    toggleVal ? "text-highlight-light" : "text-text-dark"
                }
            >
                <StarIcon />
            </div>

            {/* tooltip */}
            <div
                className={`${
                    showTooltip ? "absolute" : "hidden"
                } text-background-light bg-text-primary text-xs px-2 py-1`}
                role="tooltip"
            >
                {toggleVal ? "Remove from Favorites" : "Add to Favorites"}
            </div>
        </button>
    );
}

export default FavoriteButton;

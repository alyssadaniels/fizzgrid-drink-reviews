import HorizontalDrinkCard from "./HorizontalDrinkCard";
import VerticalDrinkCard from "./VerticalDrinkCard";
import { MD_SCREEN_BREAKPOINT } from "../../../util/constants";
import { useMediaQuery } from "@uidotdev/usehooks";

/**
 * Drinks container for DrinkCards
 * @param drinkIDs ids of drinks to display
 * @returns DrinksContainer component
 */
function DrinksContainer({ drinkIDs }: { drinkIDs: number[] }) {
    const mdScreen = useMediaQuery(`(min-width: ${MD_SCREEN_BREAKPOINT}px)`);

    return (
        <div className="flex flex-col items-center gap-y-14">
            {drinkIDs.length > 0 ? (
                drinkIDs.map((id) =>
                    mdScreen ? (
                        <HorizontalDrinkCard key={id} drinkID={id} />
                    ) : (
                        <VerticalDrinkCard key={id} drinkID={id} />
                    )
                )
            ) : (
                <p className="text-background-dark">No drinks yet</p>
            )}
        </div>
    );
}

export default DrinksContainer;

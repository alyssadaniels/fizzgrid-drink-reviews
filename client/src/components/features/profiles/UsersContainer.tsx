import { useMediaQuery } from "@uidotdev/usehooks";
import { MD_SCREEN_BREAKPOINT } from "../../../util/constants";
import HorizontalUserCard from "./HorizontalProfileCard";
import VerticalUserCard from "./VerticalProfileCard";

/**
 * Users container for UserCards
 * @param userIDs ids of users to display
 * @returns
 */
function UsersContainer({ userIDs }: { userIDs: number[] }) {
    const mdScreen = useMediaQuery(`(min-width: ${MD_SCREEN_BREAKPOINT}px)`);

    return (
        <div className="flex flex-col items-center gap-y-14">
            {userIDs.length > 0 ? (
                userIDs.map((id) =>
                    mdScreen ? (
                        <HorizontalUserCard key={id} profileID={id} />
                    ) : (
                        <VerticalUserCard key={id} profileID={id} />
                    )
                )
            ) : (
                <p className="text-background-dark">No users yet</p>
            )}
        </div>
    );
}

export default UsersContainer;

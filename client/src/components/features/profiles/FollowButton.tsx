import Button from "../../common/ui/Button";
import { ProfileData } from "../../../util/types";
import { useContext } from "react";
import { ModalContext } from "../../../util/contexts";
import { useUser } from "../../../api-hooks/actions/useUser";
import { useSetFollow } from "../../../api-hooks/actions/useSetFollow";
import useOptimisticToggle from "../../../util/useOptimisticToggle";


/**
 * Follow button for users
 * @param followingProfile profile button is attached to
 * @param isRefetching attached profile is refetching data
 * @returns FollowButton component
 */
function FollowButton({
    followingProfile,
    isRefetching,
}: {
    followingProfile: ProfileData;
    isRefetching: boolean;
}) {
    const { user } = useUser();
    const { setFollow, isPending } = useSetFollow(followingProfile.profile.id);

    // pending when attached profile is pending or when follow hook is pending
    // when not pending, following is true if there is a user && attached profile has user in following ids
    const [toggleVal, toggle] = useOptimisticToggle({
        toggleFunction: setFollow,
        getIsPending: () => {
            return isPending || isRefetching;
        },
        getValue: () => {
            return (
                !!user &&
                followingProfile.followers
                    .map((follow) => follow.follower_id)
                    .includes(user.id)
            );
        },
    });

    const modalContext = useContext(ModalContext);

    /**
     * handle button click
     */
    function handleClick() {
        // handle request if user is logged in, otherwise show login pop up
        if (!user) {
            modalContext.setShowLoginModal(true);
        }

        toggle();
    }

    return (
        <>
            {toggleVal ? (
                <Button
                    text="Unfollow"
                    onClick={(event) => {
                        event.preventDefault();
                        handleClick();
                    }}
                    isPrimary={false}
                />
            ) : (
                <Button
                    text="Follow"
                    onClick={(event) => {
                        event.preventDefault();
                        handleClick();
                    }}
                    isPrimary={true}
                />
            )}
        </>
    );
}

export default FollowButton;

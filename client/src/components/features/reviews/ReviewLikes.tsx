import { ReviewData } from "../../../util/types";
import { HeartIcon } from "../../common/icons";
import { useContext } from "react";
import { ModalContext } from "../../../util/contexts";
import { useUser } from "../../../api-hooks/actions/useUser";
import { useSetReviewLike } from "../../../api-hooks/actions/useSetReviewLike";
import useOptimisticToggle from "../../../util/useOptimisticToggle";

/**
 * Review likes display component
 * Displays number of likes for a review
 * When clicked, toggle if the user has liked the connected item
 * @param reviewData data for review
 * @returns ReviewLikes component
 */
function ReviewLikes({
    reviewData,
    isRefetching,
}: {
    reviewData: ReviewData;
    isRefetching: boolean;
}) {
    const { user } = useUser();
    const { setReviewLike, isPending } = useSetReviewLike(reviewData.review.id);
    const [toggleVal, toggle] = useOptimisticToggle({
        toggleFunction: setReviewLike,
        getIsPending: () => {
            return isPending || isRefetching;
        },
        getValue: () => {
            return (
                !!user &&
                reviewData.likes
                    .map((like) => like.profile_id)
                    .includes(user.id)
            );
        },
    });

    const modalContext = useContext(ModalContext);

    function handleClick() {
        if (!user) {
            modalContext.setShowLoginModal(true);
        }

        toggle();
    }

    return (
        <div className="flex flex-col items-center">
            <button
                className={`flex flex-col items-center ${
                    toggleVal ? "text-highlight-light" : "text-background-dark"
                }`}
                onClick={(event) => {
                    event.preventDefault();
                    handleClick();
                }}
            >
                <HeartIcon />
            </button>

            <p className="text-xs text-center">{reviewData.likes.length}</p>
        </div>
    );
}

export default ReviewLikes;

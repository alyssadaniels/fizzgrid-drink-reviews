import { CommentData } from "../../../../util/types";
import { HeartIcon } from "../../../common/icons";
import { useContext } from "react";
import { ModalContext } from "../../../../util/contexts";
import { useUser } from "../../../../api-hooks/actions/useUser";
import { useSetCommentLike } from "../../../../api-hooks/actions/useSetCommentLike";
import useOptimisticToggle from "../../../../util/useOptimisticToggle";

/**
 * Comment likes display component
 * Displays number of likes for a comment
 * When clicked, toggle if the user has liked the connected item
 * @param commentData data for associated comment
 * @param isRefetching is parent refetching data
 * @returns Comment likes icon component
 */
function CommentLikes({
    commentData,
    isRefetching,
}: {
    commentData: CommentData;
    isRefetching: boolean;
}) {
    const { user } = useUser();
    const { setCommentLike, isPending } = useSetCommentLike(
        commentData.comment.id
    );

    const [toggleVal, toggle] = useOptimisticToggle({
        toggleFunction: setCommentLike,
        getIsPending: () => {
            return isPending || isRefetching;
        },
        getValue: () => {
            return (
                !!user &&
                commentData.likes
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

            <p className="text-xs text-center">{commentData.likes.length}</p>
        </div>
    );
}

export default CommentLikes;

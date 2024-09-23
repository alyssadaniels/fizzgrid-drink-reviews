import ProfilePicture from "../../profiles/ProfilePicture";
import TypedInput from "../../../common/ui/TypedInput";
import { COMMENT_MAX_LENGTH } from "../../../../util/constants";
import { LoadingCircle, SendIcon } from "../../../common/icons";
import TextButton from "../../../common/ui/TextButton";
import { useContext } from "react";
import { ModalContext } from "../../../../util/contexts";
import { useUser } from "../../../../api-hooks/actions/useUser";
import { usePostComment } from "../../../../api-hooks/actions/usePostComment";

/**
 * Write comment component
 * @param reviewID id for associated review
 * @returns WriteComment component
 */
function WriteComment({ reviewID }: { reviewID: number }) {
    const { user } = useUser();
    const { postComment, isPending, error } = usePostComment(reviewID);

    const modalContext = useContext(ModalContext);

    if (!user) {
        return (
            <p className="text-background-dark">
                <TextButton
                    text="Log in"
                    onClick={() => {
                        modalContext.setShowLoginModal(true);
                    }}
                    isPrimary={false}
                />{" "}
                to leave a comment
            </p>
        );
    }

    return (
        <form
            id="commentForm"
            className="grid grid-cols-6 py-4 items-center"
            onSubmit={(event) => {
                event.preventDefault();

                const text = event.currentTarget.commentText.value;

                event.currentTarget.reset();

                postComment(text);
            }}
        >
            <div className="size-14 col-span-1">
                <ProfilePicture imageURL={user.profile_img} />
            </div>
            <div className="col-span-4">
                <TypedInput
                    id="commentText"
                    label=""
                    placeholder="Write a comment..."
                    maxLength={COMMENT_MAX_LENGTH}
                    showMaxLength={true}
                    showCharacters={true}
                />
                <p className="text-highlight-dark">{error?.message}</p>
            </div>
            <div className="col-span-1 text-center ">
                {isPending ? (
                    /* loading */
                    <div className="flex justify-center py-2s">
                        <LoadingCircle />
                    </div>
                ) : (
                    /* submit */
                    <button className="text-highlight-light hover:text-highlight-dark">
                        <SendIcon />
                    </button>
                )}
            </div>
        </form>
    );
}

export default WriteComment;

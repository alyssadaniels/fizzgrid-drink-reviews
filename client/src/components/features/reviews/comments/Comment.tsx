import ProfilePicture from "../../profiles/ProfilePicture";
import TextButton from "../../../common/ui/TextButton";
import CommentLikes from "./CommentLikes";
import { LoadingCircle } from "../../../common/icons";
import { useFetchComment } from "../../../../api-hooks/gets/reviewHooks";
import { useUser } from "../../../../api-hooks/actions/useUser";
import { useDeleteComment } from "../../../../api-hooks/actions/useDeleteComment";

/**
 * Comment component - displays a single comment
 * @param commentData data for comment
 * @returns Comment component
 */
function Comment({ commentID }: { commentID: number }) {
    const { data, isRefetching, isLoading } = useFetchComment(commentID);
    const { user } = useUser();
    const { deleteComment } = useDeleteComment(commentID);

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
        <div className="grid grid-cols-6 py-4">
            {/* commenter profile picture */}
            <div className="col-span-1 size-14">
                <ProfilePicture imageURL={data.profile.profile_img} />
            </div>

            <div className="col-span-4">
                <p className="font-bold break-all">{data.profile.username}</p>
                <p className="text-background-dark text-sm">
                    {data.comment.date_created.toDateString()}
                </p>
                <p>{data.comment.comment_text}</p>
            </div>

            {/* delete or like button */}
            <div className="col-span-1 text-center">
                {user && user.id == data.profile.id ? (
                    <TextButton
                        text="Delete"
                        onClick={() => {
                            const confirmation = confirm(
                                `Delete your comment ${data.comment.comment_text}? This action is permanent and can not be undone.`
                            );

                            if (confirmation) {
                                deleteComment();
                            }
                        }}
                        isPrimary={false}
                    />
                ) : (
                    <CommentLikes
                        commentData={data}
                        isRefetching={isRefetching}
                    />
                )}
            </div>
        </div>
    );
}

export default Comment;

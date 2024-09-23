import Comment from "./Comment";
import { ReviewComment } from "../../../../util/types";

/**
 * Container for displaying comments
 * @param commentIDs ids of comments to display
 * @returns CommentsContainer component
 */
function CommentsContainer({ comments }: { comments: ReviewComment[] }) {
    // sort by date
    const sortedComments = comments.sort((c1, c2) => {
        const c1Date = c1.date_created;
        const c2Date = c2.date_created;

        if (c1Date < c2Date) {
            return 1;
        } else if (c1Date > c2Date) {
            return -1;
        } else {
            return 0;
        }
    });

    return (
        <div className="flex flex-col divide-y">
            {sortedComments.length > 0 ? (
                <>
                    {sortedComments.map((comment) => {
                        return (
                            <Comment key={comment.id} commentID={comment.id} />
                        );
                    })}
                </>
            ) : (
                <p className="text-background-dark">No comments yet</p>
            )}
        </div>
    );
}

export default CommentsContainer;

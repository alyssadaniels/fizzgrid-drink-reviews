import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { CommentLike } from "../../util/types";

async function fetchCommentLike(liked: boolean, commentID: number) {
    const method = liked ? "DELETE" : "POST";

    const response = await fetchWithCredentials(
        `${API_URL}/reviews/comment/${commentID}/like/`,
        method
    );

    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json as CommentLike;
}

export function useSetCommentLike(commentID: number) {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: setCommentLike,
    } = useMutation({
        mutationFn: (liked: boolean) => fetchCommentLike(liked, commentID),
        onSuccess: (data) =>
            // refetch data for comment that was liked/unliked
            {
                queryClient.refetchQueries({
                    queryKey: ["comment", data.comment_id, "likes"],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, setCommentLike };
}
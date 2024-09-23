import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { ReviewComment } from "../../util/types";

async function fetchPostComment(reviewID: number, commentText: string) {
    // form data
    const formData = new FormData();
    formData.append("comment_text", commentText);
    formData.append("review_id", reviewID.toString());

    // request
    const response = await fetchWithCredentials(
        `${API_URL}/reviews/comment/`,
        "POST",
        formData
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json as ReviewComment;
}

export function usePostComment(reviewID: number) {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: postComment,
    } = useMutation({
        mutationFn: (commentText: string) =>
            fetchPostComment(reviewID, commentText),
        onSuccess: (data) =>
            // refetch data for review comments
            {
                queryClient.refetchQueries({
                    queryKey: ["review", data.review_id, "comments"],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, postComment };
}

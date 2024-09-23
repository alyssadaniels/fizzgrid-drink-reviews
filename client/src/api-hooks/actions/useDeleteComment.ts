import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { ReviewComment } from "../../util/types";

async function fetchDeleteComment(commentID: number) {
    const response = await fetchWithCredentials(
        `${API_URL}/reviews/comment/${commentID}/`,
        "DELETE"
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json as ReviewComment;
}

export function useDeleteComment(commentID: number) {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: deleteComment,
        isSuccess,
    } = useMutation({
        mutationFn: () => fetchDeleteComment(commentID),
        onSuccess: (data) =>
            // refetch data for review comments
            {
                queryClient.refetchQueries({
                    queryKey: ["review", data.review_id, "comments"],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, deleteComment, isSuccess };
}

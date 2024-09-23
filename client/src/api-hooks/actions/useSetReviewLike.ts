import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { ReviewLike } from "../../util/types";

async function fetchReviewLike(liked: boolean, reviewID: number) {
    const method = liked ? "DELETE" : "POST";

    const response = await fetchWithCredentials(
        `${API_URL}/reviews/review/${reviewID}/like/`,
        method
    );

    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json as ReviewLike;
}

export function useSetReviewLike(reviewID: number) {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: setReviewLike,
    } = useMutation({
        mutationFn: (liked: boolean) => fetchReviewLike(liked, reviewID),
        onSuccess: (data) =>
            // refetch data for review that was liked/unliked
            {
                queryClient.refetchQueries({
                    queryKey: ["review", data.review_id, "likes"],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, setReviewLike };
}
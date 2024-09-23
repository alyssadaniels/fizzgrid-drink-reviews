import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { Review } from "../../util/types";

async function fetchDeleteReview(reviewID: number) {
    const response = await fetchWithCredentials(
        `${API_URL}/reviews/review/${reviewID}/`,
        "DELETE"
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json as Review;
}

export function useDeleteReview(reviewID: number) {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: deleteReview,
        isSuccess,
    } = useMutation({
        mutationFn: () => fetchDeleteReview(reviewID),
        onSuccess: (data) =>
            // refetch data for drink and profile reviews, review
            {
                queryClient.refetchQueries({
                    queryKey: ["drink", data.drink_id, "reviews"],
                    exact: true,
                });

                queryClient.refetchQueries({
                    queryKey: ["profile", data.profile_id, "reviews"],
                    exact: true,
                });

                queryClient.invalidateQueries({
                    queryKey: ["review", data.id],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, deleteReview, isSuccess };
}

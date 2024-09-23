import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { Review } from "../../util/types";

async function fetchPostReview(
    drinkID: number,
    rating: number,
    reviewText: string,
    image: File
) {
    // create form data
    const formData = new FormData();
    formData.append("drink_id", drinkID.toString());
    formData.append("rating", rating.toString());
    formData.append("review_text", reviewText);
    formData.append("image", image);

    // post
    const response = await fetchWithCredentials(
        `${API_URL}/reviews/review/`,
        "POST",
        formData
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;
        console.log(message);

        throw new Error(message);
    }

    return json as Review;
}

export function usePostReview() {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: postReview,
        isSuccess,
    } = useMutation({
        mutationFn: ({
            drinkID,
            rating,
            reviewText,
            image,
        }: {
            drinkID: number;
            rating: number;
            reviewText: string;
            image: File;
        }) => fetchPostReview(drinkID, rating, reviewText, image),
        onSuccess: (data) =>
            // refetch data for drink and profile reviews
            {
                queryClient.refetchQueries({
                    queryKey: ["drink", data.drink_id, "reviews"],
                    exact: true,
                });

                queryClient.refetchQueries({
                    queryKey: ["profile", data.profile_id, "reviews"],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, postReview, isSuccess };
}

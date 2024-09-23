import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { DrinkFavorite } from "../../util/types";

async function fetchDrinkFavorite(favorited: boolean, drinkID: number) {
    const method = favorited ? "DELETE" : "POST";
    const response = await fetchWithCredentials(
        `${API_URL}/drinks/drink/${drinkID}/favorite/`,
        method
    );

    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json as DrinkFavorite;
}

export function useSetDrinkFavorite(drinkID: number) {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: setFavorite,
    } = useMutation({
        mutationFn: (favorited: boolean) =>
            fetchDrinkFavorite(favorited, drinkID),
        onSuccess: (data) =>
            // refetch data for drink and profile favorites
            {
                queryClient.refetchQueries({
                    queryKey: ["drink", data.drink_id, "favorites"],
                    exact: true,
                });

                queryClient.refetchQueries({
                    queryKey: ["profile", data.profile_id, "favorites"],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, setFavorite };
}

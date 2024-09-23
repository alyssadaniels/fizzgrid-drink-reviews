import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { Follow } from "../../util/types";

async function fetchFollow(following: boolean, profileID: number) {
    const method = following ? "DELETE" : "POST";

    const response = await fetchWithCredentials(
        `${API_URL}/profiles/profile/${profileID}/follow/`,
        method
    );

    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json as Follow;
}

export function useSetFollow(profileID: number) {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: setFollow,
    } = useMutation({
        mutationFn: (following: boolean) => fetchFollow(following, profileID),
        onSuccess: (data) =>
            // refetch data for profile that was followed/unfollowed
            {
                queryClient.refetchQueries({
                    queryKey: ["profile", data.following_id, "followers"],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, setFollow };
}

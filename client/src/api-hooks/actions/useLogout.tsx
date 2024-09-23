import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";

async function fetchLogout() {
    const response = await fetchWithCredentials(
        `${API_URL}/profiles/logout/`,
        "POST"
    );

    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json;
}

export function useLogout() {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: logout,
        isSuccess,
    } = useMutation({
        mutationFn: () => fetchLogout(),
        onSuccess: () =>
            queryClient.removeQueries({ queryKey: ["active-profile"] }),
    });

    return { data, error, isPending, logout, isSuccess };
}

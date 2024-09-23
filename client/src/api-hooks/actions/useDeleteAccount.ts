import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";

async function fetchDeleteAccount({
    confirmation,
    password,
}: {
    confirmation: boolean;
    password: string;
}) {
    if (!confirmation) {
        throw new Error("Check confirmation box to continue");
    }

    // form data
    const formData = new FormData();
    formData.append("password", password);

    // request
    const response = await fetchWithCredentials(
        `${API_URL}/profiles/profile/`,
        "DELETE",
        formData
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";

        if (json) message = json.detail;

        throw new Error(message);
    }

    return json;
}

export function useFetchDeleteAccount() {
    const queryClient = useQueryClient();

    const {
        data,
        mutate: deleteAccount,
        error,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: ({
            confirmation,
            password,
        }: {
            confirmation: boolean;
            password: string;
        }) =>
            fetchDeleteAccount({
                password: password,
                confirmation: confirmation,
            }),

        onSuccess: () =>
            queryClient.removeQueries({ queryKey: ["active-profile"] }),
    });

    return { data, deleteAccount, error, isPending, isSuccess };
}

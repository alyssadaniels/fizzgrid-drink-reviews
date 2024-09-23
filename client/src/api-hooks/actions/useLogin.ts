import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { Profile } from "../../util/types";

async function fetchLogin(username: string, password: string) {
    // form data
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // request
    const response = await fetchWithCredentials(
        `${API_URL}/profiles/login/`,
        "POST",
        formData
    );

    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (json) message = json.detail;

        throw new Error(message);
    }

    // format data
    let data: Profile = {
        id: json.profile.id,
        username: json.user.username,
        profile_img: json.profile.profile_img,
        email: json.user.email,
    };
    return data;
}

export function useLogin() {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: login,
    } = useMutation({
        mutationFn: ({
            username,
            password,
        }: {
            username: string;
            password: string;
        }) => {
            return fetchLogin(username, password);
        },

        onSuccess: (data) => queryClient.setQueryData(["active-profile"], data),
    });

    return { data, error, isPending, login };
}

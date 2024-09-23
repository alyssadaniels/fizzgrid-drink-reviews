import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { Profile } from "../../util/types";

async function fetchPostSignUp({
    email,
    username,
    password,
    image,
}: {
    email: string;
    username: string;
    password: string;
    image: File;
}) {
    // format data
    const formData = new FormData();

    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", image);

    const response = await fetchWithCredentials(
        `${API_URL}/profiles/profile/`,
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

export function usePostSignUp() {
    const queryClient = useQueryClient();

    const {
        data,
        mutate: signUp,
        error,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: ({
            email,
            username,
            password,
            image,
        }: {
            email: string;
            username: string;
            password: string;
            image: File;
        }) =>
            fetchPostSignUp({
                email: email,
                username: username,
                password: password,
                image: image,
            }),

        onSuccess: (data) => queryClient.setQueryData(["active-profile"], data),
    });

    return { data, signUp, error, isPending, isSuccess };
}

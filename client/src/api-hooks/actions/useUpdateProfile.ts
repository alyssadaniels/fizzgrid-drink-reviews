import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";
import { Profile } from "../../util/types";

async function fetchPutProfile({
    email,
    username,
    password,
    newPassword,
    image,
}: {
    email: string | undefined;
    username: string | undefined;
    password: string;
    newPassword: string | undefined;
    image: File | undefined;
}) {
    // format data for body
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (username) formData.append("username", username);
    if (password) formData.append("password", password);
    if (newPassword) formData.append("new_password", newPassword);
    if (image) formData.append("image", image);

    // request
    const response = await fetchWithCredentials(
        `${API_URL}/profiles/profile/`,
        "PUT",
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

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isPending,
        mutate: updateProfile,
        isSuccess,
    } = useMutation({
        mutationFn: ({
            email,
            username,
            password,
            newPassword,
            image,
        }: {
            email: string | undefined;
            username: string | undefined;
            password: string;
            newPassword: string | undefined;
            image: File | undefined;
        }) =>
            fetchPutProfile({
                email: email,
                username: username,
                password: password,
                newPassword: newPassword,
                image: image,
            }),
        onSuccess: (data) =>
            // refetch data for profile
            {
                queryClient.refetchQueries({
                    queryKey: ["active-profile"],
                    exact: true,
                });
                queryClient.refetchQueries({
                    queryKey: ["profile", data.id],
                    exact: true,
                });
            },
    });

    return { data, error, isPending, updateProfile, isSuccess };
}

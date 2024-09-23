import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../util/constants";
import { Profile } from "../../util/types";

async function fetchUser(): Promise<Profile> {
    const response = await fetch(`${API_URL}/profiles/profile/`, {
        credentials: "include",
    });
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

export function useUser(): {
    user: Profile | undefined;
    isLoading: boolean;
    error: Error | null;
} {
    const {
        data: user,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["active-profile"],
        queryFn: () => fetchUser(),
        // staleTime: 0,
        retry: 0,
    });

    return { user, isLoading, error };
}

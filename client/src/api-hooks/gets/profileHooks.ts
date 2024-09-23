import { useQuery } from "@tanstack/react-query";
import { Profile, ProfileData } from "../../util/types";
import {
    fetchFollows,
    fetchProfile,
    fetchProfiles,
} from "./profileGetFunctions";
import { fetchDrinkFavorites } from "./drinkGetFunctions";
import { fetchReviews } from "./reviewGetFunctions";

export function useFetchProfile(profileID: number): {
    data: ProfileData | undefined;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
} {
    // profile
    const {
        data: profile,
        isLoading: profileLoading,
        isError: profileError,
    } = useQuery({
        queryKey: ["profile", profileID],
        queryFn: () => fetchProfile(profileID),
    });

    // follows where profile is the follower
    const {
        data: following,
        isLoading: followingLoading,
        isError: followingError,
    } = useQuery({
        queryKey: ["following", profileID],
        queryFn: () => fetchFollows({ followerID: profileID }),
    });

    // follows where profile is followed/the following
    const {
        data: followers,
        isLoading: followersLoading,
        isError: followersError,
        isRefetching,
    } = useQuery({
        queryKey: ["followers", profileID],
        queryFn: () => fetchFollows({ followingID: profileID }),
    });

    // favorites
    const {
        data: favorites,
        isLoading: favoritesLoading,
        isError: favoritesError,
    } = useQuery({
        queryKey: ["profile", profileID, "favorites"],
        queryFn: () => fetchDrinkFavorites({ profileID: profileID }),
    });

    // reviews
    const {
        data: reviews,
        isLoading: reviewsLoading,
        isError: reviewsError,
    } = useQuery({
        queryKey: ["profile", profileID, "reviews"],
        queryFn: () => fetchReviews({ profileID: profileID }),
    });

    // consolidate
    let data;

    if (profile && followers && following && favorites && reviews) {
        data = {
            profile: profile,
            followers: followers,
            following: following,
            favorites: favorites,
            reviews: reviews,
        };
    }

    const isLoading =
        profileLoading ||
        followersLoading ||
        followingLoading ||
        favoritesLoading ||
        reviewsLoading;
    const isError =
        profileError ||
        followersError ||
        followingError ||
        favoritesError ||
        reviewsError;

    return { data, isLoading, isError, isRefetching };
}

export function useFetchProfiles(
    page = 1,
    search = ""
): {
    data: { profiles: Profile[]; num_pages: number } | undefined;
    isLoading: boolean;
    isError: boolean;
} {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["profiles", { page, search }],
        queryFn: () => fetchProfiles({ page: page, search: search }),
    });

    return { data, isLoading, isError };
}

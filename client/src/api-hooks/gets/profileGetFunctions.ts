import { API_URL } from "../../util/constants";
import { FetchError, Follow, Profile } from "../../util/types";

/**
 * Fetch profiles function (paginated)
 * @param page page of profiles, default 1
 * @param search search query, default ""
 * @returns profiles - list of Profiles
 * @returns num_pages - number of pages
 */
export async function fetchProfiles({
    page = 1,
    search = "",
}): Promise<{ profiles: Profile[]; num_pages: number }> {
    // get profiles
    const response = await fetch(
        `${API_URL}/profiles/?search=${search}&page=${page}`
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    // format data
    let data: Profile[] = [];

    for (let i = 0; i < json.profiles.length; i++) {
        data.push({
            id: json.profiles[i].profile.id,
            profile_img: json.profiles[i].profile.profile_img,
            username: json.profiles[i].user.username,
        });
    }

    return { profiles: data, num_pages: json.num_pages };
}

/**
 * Fetch profile with profile id
 * @param profileID id of profile to get
 * @returns Profile
 */
export async function fetchProfile(profileID: number): Promise<Profile> {
    // get profile
    const response = await fetch(`${API_URL}/profiles/profile/${profileID}`);
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    // format data
    let data: Profile = {
        id: json.profile.id,
        profile_img: json.profile.profile_img,
        username: json.user.username,
    };

    return data;
}

/**
 * Fetch follows
 * @param followerID id of follower
 * @param followingID id of following
 * @returns array of Follows
 */
export async function fetchFollows({
    followerID,
    followingID,
}: {
    followerID?: number;
    followingID?: number;
}): Promise<Follow[]> {
    let url = `${API_URL}/profiles/follows/?`;

    // add queries
    if (followerID != undefined) url += `follower=${followerID}&`;
    if (followingID != undefined) url += `following=${followingID}`;

    // request
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    // format
    for (let i = 0; i < json.follows.length; i++) {
        json.follows[i].date_created = new Date(Date.parse(json.date_created));
    }

    return (json as { follows: Follow[] }).follows;
}

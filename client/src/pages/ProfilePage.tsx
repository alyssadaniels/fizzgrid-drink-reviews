import { useState } from "react";
import { useParams } from "react-router-dom";
import { MD_SCREEN_BREAKPOINT } from "../util/constants";
import PageContainer from "../components/common/layouts/PageContainer";
import InternalLink from "../components/common/ui/InternalLink";
import DrinksContainer from "../components/features/drinks/DrinksContainer";
import HorizontalSelect from "../components/common/ui/HorizontalSelect";
import UsersContainer from "../components/features/profiles/UsersContainer";
import { LoadingCircle } from "../components/common/icons";
import HorizontalUserCard from "../components/features/profiles/HorizontalProfileCard";
import VerticalUserCard from "../components/features/profiles/VerticalProfileCard";
import ReviewsGrid from "../components/features/reviews/ReviewsGrid";
import { useFetchProfile } from "../api-hooks/gets/profileHooks";
import { useMediaQuery } from "@uidotdev/usehooks";


enum ProfilePages {
    Reviews = "Reviews",
    Favorites = "Favorites",
    Followers = "Followers",
    Following = "Following",
}

/**
 * Profile page - displays info for a single user
 * @returns Profile page component
 */
function ProfilePage() {
    // get id
    const { slug } = useParams();

    const profileID = parseInt(slug ? slug : "");
    const { data, isLoading, isError } = useFetchProfile(profileID);

    // page data
    const [page, setPage] = useState<ProfilePages>(ProfilePages.Reviews);
    const mdScreen = useMediaQuery(`(min-width: ${MD_SCREEN_BREAKPOINT}px)`);

    const selectOptions = [
        {
            label: ProfilePages.Reviews,
            setData: () => {
                setPage(ProfilePages.Reviews);
            },
        },
        {
            label: ProfilePages.Favorites,
            setData: () => {
                setPage(ProfilePages.Favorites);
            },
        },
        {
            label: ProfilePages.Followers,
            setData: () => {
                setPage(ProfilePages.Followers);
            },
        },
        {
            label: ProfilePages.Following,
            setData: () => {
                setPage(ProfilePages.Following);
            },
        },
    ];

    return (
        <PageContainer>
            {isError ? (
                <p>
                    User not found.{" "}
                    <InternalLink text="Explore all users" to="/users" />
                </p>
            ) : isLoading ? (
                <div className="w-fit mx-auto">
                    <LoadingCircle />
                </div>
            ) : (
                data && (
                    <>
                        {mdScreen ? (
                            <HorizontalUserCard profileID={data.profile.id} />
                        ) : (
                            <VerticalUserCard profileID={data.profile.id} />
                        )}

                        <br />

                        {mdScreen ? (
                            <HorizontalSelect selectOptions={selectOptions} />
                        ) : (
                            <select
                                onChange={(event) => {
                                    setPage(
                                        event.currentTarget
                                            .value as ProfilePages
                                    );
                                }}
                                className="bg-transparent text-lg hover:cursor-pointer"
                            >
                                {selectOptions.map((option) => {
                                    return (
                                        <option key={option.label} value={option.label}>
                                            {option.label}
                                        </option>
                                    );
                                })}
                            </select>
                        )}

                        <div className="border-b-2 my-4"></div>

                        <div className="flex flex-col items-center">
                            {page === ProfilePages.Reviews ? (
                                <ReviewsGrid
                                    reviewIDs={data.reviews.reviews.map(
                                        (review) => review.id
                                    )}
                                />
                            ) : page === ProfilePages.Favorites ? (
                                <div className="flex flex-col gap-6">
                                    <DrinksContainer
                                        drinkIDs={data.favorites.map(
                                            (favorite) => favorite.drink_id
                                        )}
                                    />
                                </div>
                            ) : page === ProfilePages.Followers ? (
                                <UsersContainer
                                    userIDs={data.followers.map(
                                        (follow) => follow.follower_id
                                    )}
                                />
                            ) : page === ProfilePages.Following ? (
                                <UsersContainer
                                    userIDs={data.following.map(
                                        (follow) => follow.following_id
                                    )}
                                />
                            ) : (
                                <LoadingCircle />
                            )}
                        </div>
                    </>
                )
            )}
        </PageContainer>
    );
}

export default ProfilePage;

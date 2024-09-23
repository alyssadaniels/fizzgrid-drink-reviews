import { useState } from "react";
import { MD_SCREEN_BREAKPOINT } from "../util/constants";
import PageContainer from "../components/common/layouts/PageContainer";
import HorizontalUserCard from "../components/features/profiles/HorizontalProfileCard";
import VerticalUserCard from "../components/features/profiles/VerticalProfileCard";
import { LoadingCircle } from "../components/common/icons";
import { useDebounce, useMediaQuery } from "@uidotdev/usehooks";
import PageIndicator from "../components/common/ui/PageIndicator";
import TextButton from "../components/common/ui/TextButton";
import { useFetchProfiles } from "../api-hooks/gets/profileHooks";
import { useUser } from "../api-hooks/actions/useUser";

/**
 * Users explore page - search for users
 * @returns Users explore page component
 */
function UsersExplorePage() {
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const debouncedSearch = useDebounce(search, 1000);

    const { data, isLoading } = useFetchProfiles(page, debouncedSearch);
    const { user } = useUser();

    const mdScreen = useMediaQuery(`(min-width: ${MD_SCREEN_BREAKPOINT}px)`);

    return (
        <PageContainer>
            <div className="flex flex-col items-center">
                {/* search */}
                <input
                    className="py-1 px-2 rounded border w-8/12 min-w-96 mx-auto"
                    type="search"
                    placeholder="Search"
                    onChange={(event) => setSearch(event.target.value)}
                />

                {/* pages */}
                {data && data.profiles.length > 0 && (
                    <>
                        <br />

                        <PageIndicator
                            page={page}
                            setPage={setPage}
                            numPages={data.num_pages}
                        />
                    </>
                )}

                {/* results */}
                {isLoading ? (
                    <div className="mx-auto w-fit">
                        <LoadingCircle />
                    </div>
                ) : (
                    data && (
                        <div className="flex flex-col gap-y-14">
                            {data.profiles
                                .filter((profile) => {
                                    // exclude logged in user
                                    const isUser =
                                        !!user && user.id == profile.id;

                                    return !isUser;
                                })
                                .map((profile) => {
                                    return mdScreen ? (
                                        <HorizontalUserCard
                                            key={profile.id}
                                            profileID={profile.id}
                                        />
                                    ) : (
                                        <VerticalUserCard
                                            key={profile.id}
                                            profileID={profile.id}
                                        />
                                    );
                                })}
                        </div>
                    )
                )}

                {/* show message if no drinks */}
                <br />
                {data &&
                    (data.profiles.length > 0 ? (
                        <>
                            <PageIndicator
                                page={page}
                                setPage={setPage}
                                numPages={data.num_pages}
                            />
                            <br />
                            <div className="w-fit mx-auto">
                                <TextButton
                                    text="Back to top"
                                    onClick={() => {
                                        document.documentElement.scrollTop = 0;
                                    }}
                                    isPrimary={false}
                                />
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-background-dark">
                            No users found
                        </p>
                    ))}
            </div>
        </PageContainer>
    );
}

export default UsersExplorePage;

import { MD_SCREEN_BREAKPOINT } from "../util/constants";
import PageContainer from "../components/common/layouts/PageContainer";
import TextButton from "../components/common/ui/TextButton";
import HorizontalDrinkCard from "../components/features/drinks/HorizontalDrinkCard";
import VerticalDrinkCard from "../components/features/drinks/VerticalDrinkCard";
import { LoadingCircle } from "../components/common/icons";
import { useState } from "react";
import { useDebounce, useMediaQuery } from "@uidotdev/usehooks";
import PageIndicator from "../components/common/ui/PageIndicator";
import { useFetchDrinks } from "../api-hooks/gets/drinkHooks";

/**
 * Drinks page - displays info for many Drinks
 * Users can search for Drinks and sort results
 * @returns Drinks page component
 */
function DrinksPage() {
    const mdScreen = useMediaQuery(`(min-width: ${MD_SCREEN_BREAKPOINT}px)`);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 1000);

    const { data, isLoading, isRefetching } = useFetchDrinks(
        page,
        debouncedSearch
    );

    return (
        <>
            <PageContainer>
                <div className="w-full items-center gap-x-4 flex">
                    {/* search bar */}
                    <input
                        className="py-1 px-2 rounded border w-8/12 min-w-96 bg-highlight-secondary"
                        type="search"
                        placeholder="Search"
                        id="search"
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                    />
                    {(search != debouncedSearch || isRefetching) && (
                        <LoadingCircle />
                    )}
                </div>

                {/* pages */}
                {data && data.drinks.length > 0 && (
                    <>
                        <br />

                        <PageIndicator
                            page={page}
                            setPage={setPage}
                            numPages={data.num_pages}
                        />
                    </>
                )}

                {/* Drinks */}
                <div className="my-10 grid grid-cols-1 gap-y-14">
                    {isLoading ? (
                        <div className="mx-auto w-fit">
                            <LoadingCircle />
                        </div>
                    ) : (
                        data &&
                        data.drinks.map((drink) => {
                            return mdScreen ? (
                                <HorizontalDrinkCard
                                    key={drink.id}
                                    drinkID={drink.id}
                                />
                            ) : (
                                <VerticalDrinkCard
                                    key={drink.id}
                                    drinkID={drink.id}
                                />
                            );
                        })
                    )}
                </div>

                {/* show message if no drinks */}
                {data &&
                    (data.drinks.length > 0 ? (
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
                            No drinks found
                        </p>
                    ))}
            </PageContainer>
        </>
    );
}

export default DrinksPage;

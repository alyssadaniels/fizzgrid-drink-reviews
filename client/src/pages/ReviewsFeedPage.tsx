import PageContainer from "../components/common/layouts/PageContainer";
import { useEffect } from "react";
import ReviewsGrid from "../components/features/reviews/ReviewsGrid";
import { LoadingCircle } from "../components/common/icons";
import { xInRange } from "../util/functions";
import { debounce } from "lodash";
import TextButton from "../components/common/ui/TextButton";
import { useFetchRecentReviews } from "../api-hooks/gets/reviewHooks";

/**
 * Reviews feed - Feed of reviews (random, from following)
 * @returns Reviews feed page
 */
export default function ReviewsFeedPage() {
    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useFetchRecentReviews();

    const handleScroll = debounce(() => {
        if (
            xInRange(
                window.innerHeight + document.documentElement.scrollTop,
                document.documentElement.offsetHeight - 3,
                document.documentElement.offsetHeight + 3
            )
        ) {
            fetchNextPage();
        }
    }, 200);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <PageContainer>
            {!data ? (
                <div className="mx-auto w-fit">
                    <LoadingCircle />
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center">
                        <ReviewsGrid
                            reviewIDs={data.pages
                                .map((page) =>
                                    page.reviews.map((review) => review.id)
                                )
                                .flat()}
                        />
                    </div>

                    {isFetchingNextPage && (
                        <div className="mx-auto w-fit">
                            <LoadingCircle />
                        </div>
                    )}

                    {/* show message if all reviews are loaded */}
                    {!hasNextPage && (
                        <p className="text-sm text-center mt-8 text-background-dark">
                            You have seen all recent reviews
                        </p>
                    )}

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
            )}
        </PageContainer>
    );
}

import HomeCTA from "../components/common/HomeCTA";
import PageContainer from "../components/common/layouts/PageContainer";
import { LoadingCircle } from "../components/common/icons";
import ReviewsContainer from "../components/features/reviews/ReviewsGrid";
import InternalLink from "../components/common/ui/InternalLink";
import { useFetchRecentReviews } from "../api-hooks/gets/reviewHooks";

/**
 * Home page - displays website info and some reviews
 * @returns Home page component
 */
function HomePage() {
    const { data } = useFetchRecentReviews();

    return (
        <>
            <HomeCTA />

            <PageContainer>
                {/* reviews */}
                <h1 className="text-center text-xl font-semibold my-10">
                    Recent Reviews
                </h1>
                {!data ? (
                    <LoadingCircle />
                ) : (
                    <ReviewsContainer
                        reviewIDs={data.pages[0].reviews.map((review) => {
                            console.log(review);
                            return review.id;
                        })}
                    />
                )}

                {/* direct to reviews page */}
                <div className="text-center py-8">
                    <InternalLink text="Read more reviews" to="/explore" />
                </div>
            </PageContainer>
        </>
    );
}

export default HomePage;

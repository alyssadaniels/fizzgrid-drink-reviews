import { useContext } from "react";
import PageContainer from "../components/common/layouts/PageContainer";
import TextButton from "../components/common/ui/TextButton";
import WriteReviewForm from "../components/features/write-review/WriteReviewForm";
import { ModalContext } from "../util/contexts";
import { useUser } from "../api-hooks/actions/useUser";

/**
 * Write review page - write a review
 * @returns Write review page component
 */
function WriteReviewPage() {
    const { user } = useUser();

    const modalContext = useContext(ModalContext);

    return (
        <>
            <PageContainer>
                {user ? (
                    <div className="flex flex-col items-center">
                        {/* review content */}
                        <WriteReviewForm />
                    </div>
                ) : (
                    <p>
                        <TextButton
                            text="Log in"
                            onClick={() => {
                                modalContext.setShowLoginModal(true);
                            }}
                            isPrimary={false}
                        />{" "}
                        to write a review.
                    </p>
                )}
            </PageContainer>
        </>
    );
}

export default WriteReviewPage;

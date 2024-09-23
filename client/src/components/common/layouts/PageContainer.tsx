import { useLocation } from "react-router-dom";
import { ChildrenProps } from "../../../util/types";
import Footer from "../navigation/Footer";
import Navigation from "../navigation/Navigation";
import { useContext, useEffect } from "react";
import { ModalContext } from "../../../util/contexts";

/**
 * Container component for pages
 * Includes navbar and footer
 * @param children page children/content
 * @returns PageContainer component
 */
function PageContainer(props: ChildrenProps) {
    // close modals on page change
    const { pathname } = useLocation();
    const modalContext = useContext(ModalContext);

    useEffect(() => {
        modalContext.setShowAddDrinkModal(false);
        modalContext.setShowIssueModal(false);
        modalContext.setShowLoginModal(false);
        modalContext.setShowProfileModal(false);
    }, [pathname]);

    return (
        <div className="min-h-screen">
            <Navigation />

            <div className="w-9/12 mx-auto mt-24 mb-14">{props.children}</div>

            <Footer />
        </div>
    );
}

export default PageContainer;

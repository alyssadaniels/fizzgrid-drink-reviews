import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import DrinksExplorePage from "./pages/DrinksExplorePage";
import ReviewPage from "./pages/ReviewPage";
import ReviewsFeedPage from "./pages/ReviewsFeedPage";
import UsersExplorePage from "./pages/UsersExplorePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import WriteReviewPage from "./pages/WriteReviewPage";
import DrinkPage from "./pages/DrinkPage";
import NotFoundPage from "./pages/NotFoundPage";
import DeleteAccountPage from "./pages/DeleteAccountPage";
import { ModalContext } from "./util/contexts";
import { useState } from "react";
import LoginModal from "./components/features/authentication/LoginModal";
import EditProfileModal from "./components/features/profiles/EditProfileModal";
import ReportIssueModal from "./components/features/issues/ReportIssueModal";
import AddDrinkModal from "./components/features/issues/AddDrinkModal";
import { ScrollToTop } from "./components/common/ScrollToTop";

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: 2 } },
});

export default function App() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showEditProfileModal, setShowProfileModal] = useState(false);
    const [showAddDrinkModal, setShowAddDrinkModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);

    return (
        <QueryClientProvider client={queryClient}>
            <ModalContext.Provider
                value={{
                    setShowLoginModal: setShowLoginModal,
                    setShowProfileModal: setShowProfileModal,
                    setShowAddDrinkModal: setShowAddDrinkModal,
                    setShowIssueModal: setShowIssueModal,
                }}
            >
                <Router>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/drinks" element={<DrinksExplorePage />} />
                        <Route path="/explore" element={<ReviewsFeedPage />} />
                        <Route path="/users" element={<UsersExplorePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route
                            path="/write-review"
                            element={<WriteReviewPage />}
                        />
                        <Route
                            path="/delete-account"
                            element={<DeleteAccountPage />}
                        />
                        <Route path="/reviews/:slug" element={<ReviewPage />} />
                        <Route path="/users/:slug" element={<ProfilePage />} />
                        <Route path="/drinks/:slug" element={<DrinkPage />} />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>

                    {/* modals */}
                    {showLoginModal && <LoginModal />}
                    {showEditProfileModal && <EditProfileModal />}
                    {showIssueModal && <ReportIssueModal />}
                    {showAddDrinkModal && <AddDrinkModal />}
                </Router>
            </ModalContext.Provider>
        </QueryClientProvider>
    );
}

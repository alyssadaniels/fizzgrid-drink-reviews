import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ReviewLikes from "../../../../src/components/features/reviews/ReviewLikes";
import jest from "jest-mock";
import { http, HttpResponse } from "msw";
import { ModalContext } from "../../../../src/util/contexts";
import { queryClient, queryClientWrapper } from "../../../queryClientWrapper";
import {
    drinkImages,
    drinks,
    profiles,
    reviewLikes,
    reviews,
} from "../../../mocks/data";
import { server } from "../../../mocks/worker";
import { API_URL } from "../../../../src/util/constants";

describe("ReviewLikes", () => {
    const reviewID = 2;

    let user: UserEvent;
    let loginModalFunc: (state: boolean) => void;

    function renderReviewLikes() {
        // force refetch
        queryClient.clear();

        loginModalFunc = jest.fn(() => {});

        const value = {
            setShowLoginModal: loginModalFunc,
            setShowProfileModal: () => {},
            setShowAddDrinkModal: () => {},
            setShowIssueModal: () => {},
        };

        const review = reviews[reviewID];
        const images = drinkImages.filter(
            (image) => image.drink_id === reviewID
        );
        const profile = {
            id: review.profile_id,
            profile_img: profiles[review.profile_id].profile.profile_img,
            username: profiles[review.profile_id].user.username,
        };
        const drink = drinks[review.drink_id];
        const likes = reviewLikes.filter((like) => like.review_id === reviewID);

        render(
            queryClientWrapper({
                children: (
                    <ModalContext.Provider value={value}>
                        <ReviewLikes
                            reviewData={{
                                review: review,
                                images: images,
                                profile: profile,
                                drink: drink,
                                likes: likes,
                            }}
                            isRefetching={false}
                        />
                    </ModalContext.Provider>
                ),
            }),
            { wrapper: BrowserRouter }
        );

        user = userEvent.setup();
    }

    // clear dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render number of likes given review has", () => {
        renderReviewLikes();

        let likes = reviewLikes.filter((like) => like.review_id === reviewID);
        expect(screen.getByText(likes.length));
    });

    it("should show login modal when clicked without user", async () => {
        // force no user
        server.use(
            http.get(
                `${API_URL}/profiles/profile`,
                () => {
                    return new HttpResponse("error", { status: 404 });
                },
                { once: true }
            )
        );

        renderReviewLikes();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        let button = screen.getByRole("button");
        await user.click(button);

        expect(loginModalFunc).toBeCalled();
    });

    it("should request like/unlike when clicked", () => {
        throw Error("unimplemented - need to mock post/put/delete");
    });
});

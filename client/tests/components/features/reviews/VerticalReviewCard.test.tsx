import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ModalContext } from "../../../../src/util/contexts";
import userEvent, { UserEvent } from "@testing-library/user-event";
import jest from "jest-mock";
import { queryClient, queryClientWrapper } from "../../../queryClientWrapper";
import { BrowserRouter } from "react-router-dom";
import { server } from "../../../mocks/worker";
import { http, HttpResponse } from "msw";
import { API_URL } from "../../../../src/util/constants";
import VerticalReviewCard from "../../../../src/components/features/reviews/VerticalReviewCard";
import { drinks, profiles, reviews } from "../../../mocks/data";

describe("VerticalReviewCard", () => {
    const reviewID = 1;

    let user: UserEvent;
    let cardContainer: HTMLElement;

    function renderCard() {
        // force refetch
        queryClient.clear();

        const loginModalFunc = jest.fn(() => {});

        const value = {
            setShowLoginModal: loginModalFunc,
            setShowProfileModal: () => {},
            setShowAddDrinkModal: () => {},
            setShowIssueModal: () => {},
        };

        const { container } = render(
            queryClientWrapper({
                children: (
                    <ModalContext.Provider value={value}>
                        <VerticalReviewCard reviewId={reviewID} />
                    </ModalContext.Provider>
                ),
            }),
            { wrapper: BrowserRouter }
        );

        cardContainer = container;

        user = userEvent.setup();
    }

    // clear dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render loading circle while fetching data", async () => {
        renderCard();
        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("should render review data once data is retrieved", async () => {
        renderCard();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        // get expected (mocked) data
        const review = reviews[reviewID];
        const username = profiles[review.profile_id].user.username;
        const drinkData = drinks[review.drink_id];

        expect(screen.getByText(review.review_text));
        expect(screen.getByText(username));
        expect(screen.getByText(drinkData.product_name));
        expect(screen.getByText(drinkData.brand_name));
    });

    it("should navigate to individual review page when clicked", async () => {
        renderCard();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        await act(() => user.click(screen.getByRole("link")));

        expect(window.location.href).toMatch(
            new RegExp(`.+/reviews/${reviewID}`)
        );
    });

    it("should render nothing if data fails to be fetched", async () => {
        // force error
        server.use(
            http.get(
                `${API_URL}/reviews/review/:id`,
                () => {
                    return new HttpResponse("error", { status: 404 });
                },
                { once: true }
            )
        );

        renderCard();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        expect(cardContainer).toBeEmptyDOMElement();
    });
});

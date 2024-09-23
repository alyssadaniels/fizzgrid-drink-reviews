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
import VerticalDrinkCard from "../../../../src/components/features/drinks/VerticalDrinkCard";
import { queryClient, queryClientWrapper } from "../../../queryClientWrapper";
import { BrowserRouter } from "react-router-dom";
import { server } from "../../../mocks/worker";
import { http, HttpResponse } from "msw";
import { API_URL } from "../../../../src/util/constants";
import { drinkImages, drinks, reviews } from "../../../mocks/data";

describe("VerticalDrinkCard", () => {
    const drinkID = 3;

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
                        <VerticalDrinkCard drinkID={drinkID} />
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

    it("should render drink data once data is retrieved", async () => {
        renderCard();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        // get expected (mocked) data
        const drinkData = drinks[drinkID];
        const imageData = drinkImages.filter((image) => image.drink_id === drinkID);
        const reviewData = reviews.filter((review) => review.drink_id === drinkID);

        // drink product
        expect(screen.getByText(drinkData.product_name));

        // drink brand
        expect(screen.getByText(drinkData.brand_name));

        // image
        if (imageData.length > 0) {
            expect(screen.getByRole("img")).toHaveAttribute(
                "src",
                imageData[0].image
            );
        }

        // reviews
        expect(screen.getByText(`${reviewData.length} reviews`));
    });

    it("should navigate to individual drink page when clicked", async () => {
        renderCard();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        await act(() => user.click(screen.getByRole("link")));

        expect(window.location.href).toMatch(
            new RegExp(`.+/drinks/${drinkID}`)
        );
    });

    it("should render nothing if data fails to be fetched", async () => {
        // force error
        server.use(
            http.get(
                `${API_URL}/drinks/drink/:id`,
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

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
import VerticalProfileCard from "../../../../src/components/features/profiles/VerticalProfileCard";
import { queryClient, queryClientWrapper } from "../../../queryClientWrapper";
import { BrowserRouter } from "react-router-dom";
import { server } from "../../../mocks/worker";
import { http, HttpResponse } from "msw";
import { API_URL } from "../../../../src/util/constants";
import { profiles } from "../../../mocks/data";

describe("VerticalProfileCard", () => {
    const profileID = 1;

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
                        <VerticalProfileCard profileID={profileID} />
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

    it("should render profile data once data is retrieved", async () => {
        renderCard();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        // get expected (mocked) data
        const profileData = profiles[profileID];

        expect(screen.getByText(profileData.user.username)).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            profileData.profile.profile_img
        );
    });

    it("should navigate to individual profile page when clicked", async () => {
        renderCard();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        await act(() => user.click(screen.getByRole("link")));

        expect(window.location.href).toMatch(
            new RegExp(`.+/users/${profileID}`)
        );
    });

    it("should render nothing if data fails to be fetched", async () => {
        // force error
        server.use(
            http.get(
                `${API_URL}/profiles/profile/:id`,
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

import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ModalContext } from "../../../../src/util/contexts";
import jest from "jest-mock";
import userEvent, { UserEvent } from "@testing-library/user-event";
import FavoriteButton from "../../../../src/components/features/drinks/FavoriteButton";
import { queryClientWrapper } from "../../../queryClientWrapper";
import { API_URL } from "../../../../src/util/constants";
import {
    drinkFavorites,
    drinkImages,
    drinks,
    profiles,
    reviews,
} from "../../../mocks/data";
import { server } from "../../../mocks/worker";
import { http, HttpResponse } from "msw";

describe("FavoriteButton", () => {
    const drinkID = 1;
    const nonFavoriteProfileID = 4;

    let loginModalFunc: (state: boolean) => void;
    let button: HTMLElement;
    let user: UserEvent;

    function renderButton() {
        loginModalFunc = jest.fn(() => {});

        const value = {
            setShowLoginModal: loginModalFunc,
            setShowProfileModal: () => {},
            setShowAddDrinkModal: () => {},
            setShowIssueModal: () => {},
        };

        render(
            queryClientWrapper({
                children: (
                    <ModalContext.Provider value={value}>
                        <FavoriteButton
                            drinkData={{
                                drink: drinks[drinkID],
                                images: drinkImages.filter(
                                    (image) => image.drink_id === drinkID
                                ),
                                reviews: {
                                    reviews: reviews.filter(
                                        (review) => review.drink_id === drinkID
                                    ),
                                    num_pages: 1,
                                },
                                favorites: drinkFavorites.filter(
                                    (favorite) => favorite.drink_id === drinkID
                                ),
                            }}
                            isRefetching={false}
                        />
                    </ModalContext.Provider>
                ),
            })
        );

        button = screen.getByRole("button");
        user = userEvent.setup();
    }

    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render login modal when clicked without user", async () => {
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

        renderButton();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        await user.click(button);

        expect(loginModalFunc).toBeCalled();
    });

    it("should render 'add to favorites' tooltip on hover with no favorite", async () => {
        // force user w/out favorite
        server.use(
            http.get(
                `${API_URL}/profiles/profile`,
                () => {
                    return HttpResponse.json(profiles[nonFavoriteProfileID]);
                },
                { once: true }
            )
        );

        renderButton();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        await act(() => user.hover(button));

        expect(screen.getByRole("tooltip")).toHaveTextContent(
            /add to favorites/i
        );
    });

    it("should render 'remove from favorites' tooltip on hover with favorite", async () => {
        renderButton();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        await act(() => user.hover(button));

        expect(screen.getByRole("tooltip")).toHaveTextContent(
            /remove from favorites/i
        );
    });

    it("should request to favorite/unfavorite on click", async () => {
        const listener = ({ request, requestId }) => {
            console.log("Outgoing request:", request.method, request.url);
        };

        server.events.on("request:start", listener);

        renderButton();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        await act(() => user.click(button));

        // expect(spy).toHaveBeenCalledWith(
        //     `${API_URL}/drinks/drink/1/favorite/`,
        //     {
        //         method: "DELETE",
        //         body: undefined,
        //         credentials: "include",
        //         headers: {},
        //     }
        // );

        // clean up
        server.events.removeListener("request:start", listener);

        throw Error("unimplemented - need to mock post/put/delete");
    });
});

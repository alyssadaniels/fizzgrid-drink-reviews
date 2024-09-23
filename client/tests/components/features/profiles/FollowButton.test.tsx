import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { getByText, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ModalContext } from "../../../../src/util/contexts";
import jest from "jest-mock";
import userEvent, { UserEvent } from "@testing-library/user-event";
import FollowButton from "../../../../src/components/features/profiles/FollowButton";
import { queryClient, queryClientWrapper } from "../../../queryClientWrapper";
import { API_URL } from "../../../../src/util/constants";
import {
    drinkFavorites,
    follows,
    profiles,
    reviews,
} from "../../../mocks/data";
import { server } from "../../../mocks/worker";
import { http, HttpResponse } from "msw";

describe("FollowButton", () => {
    const profileID = 2;
    const followingID = 3;
    const notFollowingID = 1;

    let loginModalFunc: (state: boolean) => void;
    let button: HTMLElement;
    let user: UserEvent;

    function renderButton() {
        // force refetch
        queryClient.clear();

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
                        <FollowButton
                            followingProfile={{
                                profile: {
                                    id: profileID,
                                    profile_img:
                                        profiles[profileID].profile.profile_img,
                                    username: profiles[profileID].user.username,
                                },
                                followers: follows.filter(
                                    (follow) =>
                                        follow.following_id === profileID
                                ),
                                following: follows.filter(
                                    (follow) => follow.follower_id === profileID
                                ),
                                favorites: drinkFavorites.filter(
                                    (favorite) =>
                                        favorite.profile_id === profileID
                                ),
                                reviews: {
                                    reviews: reviews.filter(
                                        (review) =>
                                            review.profile_id === profileID
                                    ),
                                    num_pages: 1,
                                },
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

        renderButton();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        await user.click(button);

        expect(loginModalFunc).toBeCalled();
    });

    it("should render follow when not following", async () => {
        // force not following
        server.use(
            http.get(
                `${API_URL}/profiles/profile`,
                () => {
                    return HttpResponse.json(profiles[notFollowingID]);
                },
                { once: true }
            )
        );

        renderButton();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        expect(screen.getByText(/follow/i));
    });

    it("should render unfollow when following", async () => {
        // force following
        server.use(
            http.get(
                `${API_URL}/profiles/profile`,
                () => {
                    return HttpResponse.json(profiles[followingID]);
                },
                { once: true }
            )
        );

        renderButton();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        expect(screen.getByText(/unfollow/i));
    });

    it("should send request to follow/unfollow on click", async () => {
        renderButton();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        await act(() => user.click(button));

        // expect(global.fetch).toHaveBeenCalledWith(
        //     `${API_URL}/profiles/profile/2/follow/`,
        //     {
        //         method: "POST",
        //         body: undefined,
        //         credentials: "include",
        //         headers: {},
        //     }
        // );
        throw Error("unimplemented - need to mock post/put/delete");
    });
});

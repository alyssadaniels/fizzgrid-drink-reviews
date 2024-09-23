import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { getByRole, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";
import {
    queryClient,
    queryClientWrapper,
} from "../../../../queryClientWrapper";
import { ModalContext } from "../../../../../src/util/contexts";
import { BrowserRouter } from "react-router-dom";
import CommentLikes from "../../../../../src/components/features/reviews/comments/CommentLikes";
import { commentLikes, profiles, reviewComments } from "../../../../mocks/data";
import jest from "jest-mock";
import { http, HttpResponse } from "msw";
import { API_URL } from "../../../../../src/util/constants";
import { server } from "../../../../mocks/worker";

describe("CommentLikes", () => {
    const commentID = 3;

    let user: UserEvent;
    let loginModalFunc: (state: boolean) => void;

    function renderCommentLikes() {
        // force refetch
        queryClient.clear();

        loginModalFunc = jest.fn(() => {});

        const value = {
            setShowLoginModal: loginModalFunc,
            setShowProfileModal: () => {},
            setShowAddDrinkModal: () => {},
            setShowIssueModal: () => {},
        };

        // mock data
        let comment = reviewComments[commentID];
        let profile = {
            id: comment.profile_id,
            profile_img: profiles[comment.profile_id].profile.profile_img,
            username: profiles[comment.profile_id].user.username,
        };

        render(
            queryClientWrapper({
                children: (
                    <ModalContext.Provider value={value}>
                        <CommentLikes
                            isRefetching={false}
                            commentData={{
                                comment: comment,
                                likes: commentLikes.filter(
                                    (like) => like.comment_id === commentID
                                ),
                                profile: profile,
                            }}
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

    it("should render number of likes given comment has", () => {
        renderCommentLikes();

        let likes = commentLikes.filter(
            (like) => like.comment_id === commentID
        );
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

        renderCommentLikes();
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

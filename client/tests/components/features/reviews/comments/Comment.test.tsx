import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";
import {
    queryClient,
    queryClientWrapper,
} from "../../../../queryClientWrapper";
import { ModalContext } from "../../../../../src/util/contexts";
import Comment from "../../../../../src/components/features/reviews/comments/Comment";
import { BrowserRouter } from "react-router-dom";
import { API_URL } from "../../../../../src/util/constants";
import { http, HttpResponse } from "msw";
import { server } from "../../../../mocks/worker";
import { commentLikes, profiles, reviewComments } from "../../../../mocks/data";

describe("Comment", () => {
    const commentID = 1;

    let user: UserEvent;
    let commentContainer: HTMLElement;

    function renderComment() {
        // force refetch
        queryClient.clear();

        const value = {
            setShowLoginModal: () => {},
            setShowProfileModal: () => {},
            setShowAddDrinkModal: () => {},
            setShowIssueModal: () => {},
        };

        const { container } = render(
            queryClientWrapper({
                children: (
                    <ModalContext.Provider value={value}>
                        <Comment commentID={commentID} />
                    </ModalContext.Provider>
                ),
            }),
            { wrapper: BrowserRouter }
        );

        commentContainer = container;
        user = userEvent.setup();
    }

    // clear dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render loading circle while loading", async () => {
        renderComment();

        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("should render nothing if no data is found", async () => {
        // force error
        server.use(
            http.get(
                `${API_URL}/reviews/comment/:id`,
                () => {
                    return new HttpResponse("error", { status: 404 });
                },
                { once: true }
            )
        );

        renderComment();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        expect(commentContainer).toBeEmptyDOMElement();
    });

    it("should render comment data when loaded", async () => {
        renderComment();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        // get expected data
        const comment = reviewComments[commentID];
        const profile = profiles[comment.profile_id];
        const likes = commentLikes.filter((like) => like.comment_id === commentID);

        expect(screen.getByText(comment.comment_text));
        expect(screen.getByText(profile.user.username));
        expect(screen.getByText(likes.length));
    });

    it("should render delete button if user is author", async () => {
        // make sure user is author
        const comment = reviewComments[commentID]

        server.use(
            http.get(
                `${API_URL}/profiles/profile`,
                () => {
                    return HttpResponse.json(profiles[comment.id]);
                },
                { once: true }
            )
        );

        renderComment();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        expect(screen.getByRole("button")).toHaveTextContent(/delete/i);
    });

    it("should request delete on click", async () => {
        // make sure user is author
        const comment = reviewComments[commentID]

        server.use(
            http.get(
                `${API_URL}/profiles/profile`,
                () => {
                    return HttpResponse.json(profiles[comment.id]);
                },
                { once: true }
            )
        );

        renderComment();
        await waitForElementToBeRemoved(screen.getByTestId("loading"));

        const deleteButton = screen.getByRole("button");
        throw Error("unimplemented - need to mock post/put/delete");
    });
});

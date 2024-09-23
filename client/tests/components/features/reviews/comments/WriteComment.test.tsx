import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";
import {
    queryClient,
    queryClientWrapper,
} from "../../../../queryClientWrapper";
import { ModalContext } from "../../../../../src/util/contexts";
import { BrowserRouter } from "react-router-dom";
import WriteComment from "../../../../../src/components/features/reviews/comments/WriteComment";
import jest from "jest-mock";
import { server } from "../../../../mocks/worker";
import { http, HttpResponse } from "msw";
import { API_URL } from "../../../../../src/util/constants";

describe("WriteComment", () => {
    const reviewID = 2;

    let user: UserEvent;
    let loginModalFunc: (state: boolean) => void;

    function renderWriteComment() {
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
                        <WriteComment reviewID={reviewID} />
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

    it("should render 'log in' text when no user", () => {
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

        renderWriteComment();

        const loginButton = screen.getByRole("button");

        expect(loginButton).toHaveTextContent(/log in/i);
    });

    it("should show login modal when log in text is clicked", async () => {
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

        renderWriteComment();

        const loginButton = screen.getByRole("button");

        await user.click(loginButton);
        expect(loginModalFunc).toBeCalled();
    });

    it("should render input when logged in", async () => {
        renderWriteComment();
        // TODO figure out how to wait for fetch to complete
        await new Promise((resolve) => {
            setTimeout(() => resolve("resolved"), 300);
        });

        expect(screen.getByRole("textbox").getAttribute("placeholder")).toMatch(
            /write a comment/i
        );
    });

    it("should request comment post when form submitted", () => {
        throw Error("unimplemented - need to mock post/put/delete");
    });
});

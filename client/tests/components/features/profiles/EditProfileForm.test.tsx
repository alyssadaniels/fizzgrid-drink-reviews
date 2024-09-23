import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import {
    fireEvent,
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ModalContext } from "../../../../src/util/contexts";
import jest from "jest-mock";
import userEvent, { UserEvent } from "@testing-library/user-event";
import EditProfileForm from "../../../../src/components/features/profiles/EditProfileForm";
import { queryClient, queryClientWrapper } from "../../../queryClientWrapper";
import { BrowserRouter } from "react-router-dom";

describe("EditProfileForm", () => {
    let profileModalFunc: (state: boolean) => void;
    let user: UserEvent;

    async function renderForm() {
        // force refetch
        queryClient.clear();

        profileModalFunc = jest.fn(() => {});

        const value = {
            setShowLoginModal: () => {},
            setShowProfileModal: profileModalFunc,
            setShowAddDrinkModal: () => {},
            setShowIssueModal: () => {},
        };

        render(
            queryClientWrapper({
                children: (
                    <ModalContext.Provider value={value}>
                        <EditProfileForm />
                    </ModalContext.Provider>
                ),
            }),
            { wrapper: BrowserRouter }
        );

        user = userEvent.setup();
    }

    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should show placeholder message if not logged in", async () => {
        // force error
        await renderForm();

        expect(screen.getByText(/must be logged in/i));
    });

    it("should require password field", async () => {
        await renderForm();
        await waitForElementToBeRemoved(screen.getByText(/must be logged in/i));

        const passwordInput = screen.getByLabelText(/enter password/i);

        expect(passwordInput).toBeInvalid();
    });

    it("should navigate to delete profile page when delete profile link clicked", async () => {
        await renderForm();
        await waitForElementToBeRemoved(screen.getByText(/must be logged in/i));

        const deleteLink = screen.getByText(/delete/i);
        await user.click(deleteLink);
        expect(window.location.href).toMatch(/.+\/delete-account/);
    });

    it("should show error message when inputted data is incorrect", async () => {
        await renderForm();
        await waitForElementToBeRemoved(screen.getByText(/must be logged in/i));

        const passwordInput = screen.getByLabelText(/enter password/i);
        await user.type(passwordInput, "password");

        const submitButton = screen.getByText(/update/i);
        // TODO for some reason currentTarget does not have the right elements?? email, password, etc are undefined
        throw Error("unimplemented - event target isn't working");
        // fireEvent.submit(screen.getByRole("form"));

        // expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should post data when submit button is clicked", async () => {
        await renderForm();
        await waitForElementToBeRemoved(screen.getByText(/must be logged in/i));

        // const passwordInput = screen.getByLabelText(/enter password/i);
        // await user.type(passwordInput, "password");

        // const usernameInput = screen.getByLabelText(/username/i);
        // await user.type(usernameInput, "newusername");

        // const submitButton = screen.getByText(/update/i);
        // await user.click(submitButton);
        throw Error("unimplemented - event target isn't working");
    });

    it("should close modal on success", () => {
        throw Error("unimplemented - event target isn't working");
    });
});

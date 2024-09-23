import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ModalContext } from "../../../../src/util/contexts";
import jest from "jest-mock";
import userEvent from "@testing-library/user-event";
import EditProfileButton from "../../../../src/components/features/profiles/EditProfileButton";

describe("EditProfileButton", () => {
    it("should call show profile modal when clicked", async () => {
        // set up context
        const profileModalFunc = jest.fn(() => {});

        const value = {
            setShowLoginModal: () => {},
            setShowProfileModal: profileModalFunc,
            setShowAddDrinkModal: () => {},
            setShowIssueModal: () => {},
        };

        render(
            <ModalContext.Provider value={value}>
                <EditProfileButton />
            </ModalContext.Provider>
        );

        // click
        const button = screen.getByRole("button");
        const user = userEvent.setup();

        await user.click(button);

        expect(profileModalFunc).toHaveBeenCalled();
    });
});

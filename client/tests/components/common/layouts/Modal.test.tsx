import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";

import Modal from "../../../../src/components/common/layouts/Modal";

describe("Modal", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should pass false into setShowing prop when closed button is clicked", async () => {
        const mockSetShowingFunc = jest.fn((state: boolean) => {});

        render(<Modal setIsShowing={mockSetShowingFunc} />);

        const user = userEvent.setup();
        const button = screen.getByRole("button");

        await user.click(button);

        expect(mockSetShowingFunc).toBeCalledWith(false);
    });
});

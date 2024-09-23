import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import WriteReviewButton from "../../../../src/components/features/drinks/WriteReviewButton";
import { BrowserRouter } from "react-router-dom";

describe("WriteReviewButton", () => {
    // clear dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should show tooltip when hovered", async () => {
        render(<WriteReviewButton />, { wrapper: BrowserRouter });

        const button = screen.getByRole("button");

        const user = userEvent.setup();

        // hover
        await user.hover(button);
        expect(screen.getByRole("tooltip")).toHaveTextContent(
            /write a review/i
        );

        // unhover
        await user.unhover(button);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should navigate to write review page when clicked", async () => {
        render(<WriteReviewButton />, { wrapper: BrowserRouter });

        const button = screen.getByRole("button");

        const user = userEvent.setup();
        await user.click(button);
        expect(window.location.href).toMatch(new RegExp(".+/write-review"));
    });
});

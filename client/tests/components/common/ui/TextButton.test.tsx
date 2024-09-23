import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";
import TextButton from "../../../../src/components/common/ui/TextButton";

describe("TextButton", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should call onClick prop when clicked", async () => {
        const mockOnClick = jest.fn();

        render(<TextButton text="text" onClick={mockOnClick} />);

        const user = userEvent.setup();
        const button = screen.getByRole("button");
        await user.click(button);

        expect(mockOnClick).toHaveBeenCalled();
    });
});

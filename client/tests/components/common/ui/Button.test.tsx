import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";

import Button from "../../../../src/components/common/ui/Button";

describe("Button", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should call onClick prop when clicked", async () => {
        const mockFunc = jest.fn();
        render(<Button text="text" onClick={mockFunc} isPrimary={true} />);

        const user = userEvent.setup();
        const button = screen.getByRole("button");
        await user.click(button);

        expect(mockFunc).toBeCalled();
    });
});

import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";

import HorizontalSelect from "../../../../src/components/common/ui/HorizontalSelect";

describe("HorizontalSelect", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should have an input/option for each selectOption", async () => {
        const options = [
            { label: "Option 1", setData: jest.fn() },
            { label: "Option 2", setData: jest.fn() },
            { label: "Option 3", setData: jest.fn() },
        ];

        render(<HorizontalSelect selectOptions={options} />);

        options.forEach((option) => {
            expect(screen.getByLabelText(option.label)).toHaveRole("radio");
        });
    });

    it("should have an first input/option selected", async () => {
        const options = [
            { label: "Option 1", setData: jest.fn() },
            { label: "Option 2", setData: jest.fn() },
            { label: "Option 3", setData: jest.fn() },
        ];

        render(<HorizontalSelect selectOptions={options} />);

        const optionElems = screen.getAllByRole("radio");

        optionElems.forEach((elem, i) => {
            if (i === 0) {
                expect(elem).toBeChecked();
            } else {
                expect(elem).not.toBeChecked();
            }
        });
    });

    it("should call corresponding setData function and select option when option is selected", async () => {
        const options = [
            { label: "Option 1", setData: jest.fn() },
            { label: "Option 2", setData: jest.fn() },
            { label: "Option 3", setData: jest.fn() },
        ];

        render(<HorizontalSelect selectOptions={options} />);

        const user = userEvent.setup();
        const optionElems = screen.getAllByRole("radio");

        // click option 2
        let selectedIdx = 1;
        await user.click(optionElems[selectedIdx]);

        for (let i = 0; i < options.length; i++) {
            if (i === selectedIdx) {
                expect(options[i].setData).toBeCalled();
                expect(optionElems[i]).toBeChecked();
            } else {
                expect(options[i].setData).not.toBeCalled();
                expect(optionElems[i]).not.toBeChecked();
            }
        }
    });
});

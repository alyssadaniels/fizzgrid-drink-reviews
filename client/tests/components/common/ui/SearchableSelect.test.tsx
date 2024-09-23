import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";

import SearchableSelect from "../../../../src/components/common/ui/SearchableSelect";

describe("SearchableSelect", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should show text input and hide menu when no selection", () => {
        const options = [
            { label: "option 1", value: 1 },
            { label: "option 2", value: 2 },
            { label: "option 3", value: 3 },
        ];

        function optionFormatter(option) {
            return <div id={option.value}>{option.label}</div>;
        }

        const mockSetData = jest.fn((state) => state);
        const mockOnInputChange = jest.fn((state) => state);

        render(
            <SearchableSelect
                placeholder="placeholder"
                options={options}
                optionFormatter={optionFormatter}
                setData={mockSetData}
                dataResetValue={-1}
                onInputChange={mockOnInputChange}
            />
        );

        expect(screen.queryByRole("textbox")).toBeInTheDocument();
        expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    });

    it("should open menu with options when text input is clicked", async () => {
        const options = [
            { label: "option 1", value: 1 },
            { label: "option 2", value: 2 },
            { label: "option 3", value: 3 },
        ];

        function optionFormatter(option) {
            return <div id={option.value}>{option.label}</div>;
        }

        const mockSetData = jest.fn((state) => state);
        const mockOnInputChange = jest.fn((state) => state);

        render(
            <SearchableSelect
                placeholder="placeholder"
                options={options}
                optionFormatter={optionFormatter}
                setData={mockSetData}
                dataResetValue={-1}
                onInputChange={mockOnInputChange}
            />
        );

        const user = userEvent.setup();
        const searchInput = screen.getByRole("textbox");

        await user.click(searchInput);

        // text query based on options array defined above
        const optionLabels = screen.queryAllByText(/option/);
        const optionInputs = screen.queryAllByLabelText(/option/);

        expect(optionLabels.length).toBe(options.length);
        expect(optionInputs.length).toBe(options.length);

        optionLabels.forEach((label) => {
            expect(label).toBeVisible();
        });
    });

    it("should replace text input with option and call setData with option value when option clicked", async () => {
        const options = [
            { label: "option 1", value: 1 },
            { label: "option 2", value: 2 },
            { label: "option 3", value: 3 },
        ];

        function optionFormatter(option) {
            return <div id={option.value}>{option.label}</div>;
        }

        const mockSetData = jest.fn((state) => state);
        const mockOnInputChange = jest.fn((state) => state);

        render(
            <SearchableSelect
                placeholder="placeholder"
                options={options}
                optionFormatter={optionFormatter}
                setData={mockSetData}
                dataResetValue={-1}
                onInputChange={mockOnInputChange}
            />
        );

        const user = userEvent.setup();
        const searchInput = screen.getByRole("textbox");
        await user.click(searchInput);

        const optionElem = screen.getByText(options[0].label);
        await user.click(optionElem);

        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        expect(screen.queryByRole("radio")).not.toBeInTheDocument();

        expect(screen.queryByText("option 1")).toBeInTheDocument();
        expect(screen.queryByText("option 2")).not.toBeInTheDocument();
        expect(screen.queryByText("option 3")).not.toBeInTheDocument();

        expect(mockSetData).toBeCalled();
    });

    it("should reopen text/menu when selected option is clicked", async () => {
        const options = [
            { label: "option 1", value: 1 },
            { label: "option 2", value: 2 },
            { label: "option 3", value: 3 },
        ];

        function optionFormatter(option) {
            return <div id={option.value}>{option.label}</div>;
        }

        const mockSetData = jest.fn((state) => state);
        const mockOnInputChange = jest.fn((state) => state);

        render(
            <SearchableSelect
                placeholder="placeholder"
                options={options}
                optionFormatter={optionFormatter}
                setData={mockSetData}
                dataResetValue={-1}
                onInputChange={mockOnInputChange}
            />
        );

        // click text input
        const user = userEvent.setup();
        const searchInput = screen.getByRole("textbox");
        await user.click(searchInput);

        // click option
        const optionElem = screen.getByText(options[0].label);
        await user.click(optionElem);

        // click selected option
        const selectedElem = screen.getByText(options[0].label);
        await user.click(selectedElem);

        // text query based on options array defined above
        const optionLabels = screen.queryAllByText(/option/);
        const optionInputs = screen.queryAllByLabelText(/option/);

        expect(optionLabels.length).toBe(options.length);
        expect(optionInputs.length).toBe(options.length);

        optionLabels.forEach((label) => {
            expect(label).toBeVisible();
        });
    });

    it("should call onInputChange with input value when text input changes", async () => {
        const options = [
            { label: "option 1", value: 1 },
            { label: "option 2", value: 2 },
            { label: "option 3", value: 3 },
        ];

        function optionFormatter(option) {
            return <div id={option.value}>{option.label}</div>;
        }

        const mockSetData = jest.fn((state) => state);
        const mockOnInputChange = jest.fn((state) => state);

        render(
            <SearchableSelect
                placeholder="placeholder"
                options={options}
                optionFormatter={optionFormatter}
                setData={mockSetData}
                dataResetValue={-1}
                onInputChange={mockOnInputChange}
            />
        );

        const user = userEvent.setup();
        const searchInput = screen.getByRole("textbox");
        const textInputString = "example text";
        await user.type(searchInput, textInputString);

        expect(mockOnInputChange).toBeCalledWith(textInputString);
    });
});

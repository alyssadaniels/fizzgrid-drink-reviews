import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import TypedInput from "../../../../src/components/common/ui/TypedInput";

describe("TypedInput", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should have matching input for label", () => {
        const label = "input label";
        const id = "id";
        render(
            <TypedInput
                label={label}
                placeholder="placeholder"
                maxLength={20}
                id={id}
                showCharacters={false}
                showMaxLength={true}
            />
        );

        const inputElem = screen.getByLabelText(label);
        expect(inputElem.id).toBe(id);
    });

    it("should set max length of input to maxLength", async () => {
        const maxLength = 50;
        render(
            <TypedInput
                label={"label"}
                placeholder="placeholder"
                maxLength={maxLength}
                id={"id"}
                showCharacters={false}
                showMaxLength={true}
            />
        );

        const inputElem = screen.getByLabelText("label");

        const user = userEvent.setup();
        await user.type(inputElem, "x".repeat(maxLength + 20));

        expect(inputElem).toHaveValue("x".repeat(maxLength));
    });

    it("should show placeholder when no text has been inputted", () => {
        const placeholder = "placeholder text";
        render(
            <TypedInput
                label={"label"}
                placeholder={placeholder}
                maxLength={40}
                id={"id"}
                showCharacters={false}
                showMaxLength={true}
            />
        );

        expect(screen.queryByPlaceholderText(placeholder)).toBeInTheDocument();
    });

    it("should render characters typed/max if showMaxLength (updated on input changed)", async () => {
        const maxLength = 84;
        render(
            <TypedInput
                label={"label"}
                placeholder="placeholder"
                maxLength={maxLength}
                id={"id"}
                showCharacters={true}
                showMaxLength={true}
            />
        );

        const inputElem = screen.getByLabelText("label");

        const user = userEvent.setup();
        const typedChars = 14;

        await user.type(inputElem, "x".repeat(typedChars));

        expect(
            screen.queryByText(new RegExp(`${typedChars}.*/.*${maxLength}`))
        ).toBeInTheDocument();
    });

    it("should not render characters typed/max if not showMaxLength", () => {
        const maxLength = 26;
        render(
            <TypedInput
                label={"label"}
                placeholder="placeholder"
                maxLength={maxLength}
                id={"id"}
                showCharacters={true}
                showMaxLength={false}
            />
        );

        expect(
            screen.queryByText(new RegExp(`.*${maxLength}`))
        ).not.toBeInTheDocument();
    });

    it("should show characters typed if showCharacters", () => {
        render(
            <TypedInput
                label={"label"}
                placeholder="placeholder"
                maxLength={20}
                id={"id"}
                showCharacters={true}
                showMaxLength={false}
            />
        );

        const inputElem = screen.getByLabelText("label");

        expect(inputElem).toHaveAttribute("type", "text");
    });

    it("should hide characters typed if not showCharacters", () => {
        render(
            <TypedInput
                label={"label"}
                placeholder="placeholder"
                maxLength={20}
                id={"id"}
                showCharacters={false}
                showMaxLength={false}
            />
        );

        const inputElem = screen.getByLabelText("label");

        expect(inputElem).toHaveAttribute("type", "password");
    });

    it("should require input by default", () => {
        render(
            <TypedInput
                label={"label"}
                placeholder="placeholder"
                maxLength={20}
                id={"id"}
                showCharacters={false}
                showMaxLength={false}
            />
        );

        const inputElem = screen.getByLabelText("label");

        expect(inputElem).toBeRequired();
    });

    it("should not require input if not isRequired", () => {
        render(
            <TypedInput
                label={"label"}
                placeholder="placeholder"
                maxLength={20}
                id={"id"}
                showCharacters={false}
                showMaxLength={false}
                isRequired={false}
            />
        );

        const inputElem = screen.getByLabelText("label");

        expect(inputElem).not.toBeRequired();
    });
});

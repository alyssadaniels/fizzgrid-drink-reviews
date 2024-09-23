import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import TypedInputMulti from "../../../../src/components/common/ui/TypedInputMulti";

describe("TypedInputMulti", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should have matching input for label", () => {
        const label = "input label";
        const id = "id";
        render(
            <TypedInputMulti
                label={label}
                placeholder="placeholder"
                maxLength={20}
                id={id}
                showMaxLength={true}
            />
        );

        const inputElem = screen.getByLabelText(label);
        expect(inputElem.id).toBe(id);
    });

    it("should set max length of input to maxLength", async () => {
        const maxLength = 10;
        render(
            <TypedInputMulti
                label={"label"}
                placeholder="placeholder"
                maxLength={maxLength}
                id={"id"}
                showMaxLength={true}
            />
        );

        const inputElem = screen.getByLabelText("label");

        const user = userEvent.setup();
        await user.type(inputElem, "x".repeat(maxLength + 11));

        expect(inputElem).toHaveValue("x".repeat(maxLength));
    });

    it("should show placeholder when no text has been inputted", () => {
        const placeholder = "placeholder text";
        render(
            <TypedInputMulti
                label={"label"}
                placeholder={placeholder}
                maxLength={25}
                id={"id"}
                showMaxLength={true}
            />
        );

        expect(screen.queryByPlaceholderText(placeholder)).toBeInTheDocument();
    });

    it("should render characters typed/max if showMaxLength (updated on input changed)", async () => {
        const maxLength = 10;
        render(
            <TypedInputMulti
                label={"label"}
                placeholder="placeholder"
                maxLength={maxLength}
                id={"id"}
                showMaxLength={true}
            />
        );

        const inputElem = screen.getByLabelText("label");

        const user = userEvent.setup();
        const typedChars = 6;

        await user.type(inputElem, "x".repeat(typedChars));

        expect(
            screen.queryByText(new RegExp(`${typedChars}.*/.*${maxLength}`))
        ).toBeInTheDocument();
    });

    it("should not render characters typed/max if not showMaxLength", () => {
        const maxLength = 40;
        render(
            <TypedInputMulti
                label={"label"}
                placeholder="placeholder"
                maxLength={maxLength}
                id={"id"}
                showMaxLength={false}
            />
        );

        expect(
            screen.queryByText(new RegExp(`.*${maxLength}`))
        ).not.toBeInTheDocument();
    });

    it("should require input by default", () => {
        render(
            <TypedInputMulti
                label={"label"}
                placeholder="placeholder"
                maxLength={20}
                id={"id"}
                showMaxLength={false}
            />
        );

        const inputElem = screen.getByLabelText("label");

        expect(inputElem).toBeRequired();
    });

    it("should not require input if not isRequired", () => {
        render(
            <TypedInputMulti
                label={"label"}
                placeholder="placeholder"
                maxLength={15}
                id={"id"}
                showMaxLength={true}
                isRequired={false}
            />
        );

        const inputElem = screen.getByLabelText("label");

        expect(inputElem).not.toBeRequired();
    });
});

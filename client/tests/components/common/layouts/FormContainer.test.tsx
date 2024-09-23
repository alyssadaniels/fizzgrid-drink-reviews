import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";

import FormContainer from "../../../../src/components/common/layouts/FormContainer";

describe("FormContainer", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should not render errorMessage if it does not exist", () => {
        render(
            <FormContainer
                onSubmit={() => {}}
                formName="formName"
                submitText="submitText"
                isLoading={false}
                errorMessage={null}
            >
                Placeholder
            </FormContainer>
        );

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();

        render(
            <FormContainer
                onSubmit={() => {}}
                formName="formName"
                submitText="submitText"
                isLoading={false}
                errorMessage={undefined}
            >
                Placeholder
            </FormContainer>
        );

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();

        render(
            <FormContainer
                onSubmit={() => {}}
                formName="formName"
                submitText="submitText"
                isLoading={false}
                errorMessage={""}
            >
                Placeholder
            </FormContainer>
        );

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should render errorMessage if it exists", () => {
        const errorMessage = "Error Message";

        render(
            <FormContainer
                onSubmit={() => {}}
                formName="formName"
                submitText="submitText"
                isLoading={false}
                errorMessage={errorMessage}
            >
                Placeholder
            </FormContainer>
        );

        const errorElement = screen.queryByRole("alert");
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent(errorMessage);
    });

    it("should not render submit button if isLoading", () => {
        render(
            <FormContainer
                onSubmit={() => {}}
                formName="formName"
                submitText="submitText"
                isLoading={true}
                errorMessage={""}
            >
                Placeholder
            </FormContainer>
        );

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should render submit button if not isLoading", () => {
        render(
            <FormContainer
                onSubmit={() => {}}
                formName="formName"
                submitText="submitText"
                isLoading={false}
                errorMessage={""}
            >
                Placeholder
            </FormContainer>
        );

        expect(screen.queryByRole("button")).toBeInTheDocument();
    });

    it("should call onSubmit prop when form is submitted", async () => {
        const mockFunc = jest.fn();
        render(
            <FormContainer
                onSubmit={mockFunc}
                formName="formName"
                submitText="submitText"
                isLoading={false}
                errorMessage={""}
            >
                Placeholder
            </FormContainer>
        );

        const user = userEvent.setup();
        const submit = screen.getByRole("button");

        await user.click(submit);

        expect(mockFunc).toBeCalled();
    });
});

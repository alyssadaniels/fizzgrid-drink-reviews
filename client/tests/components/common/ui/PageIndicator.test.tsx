import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";

import PageIndicator from "../../../../src/components/common/ui/PageIndicator";

describe("PageIndicator", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should should show given page out of total number of pages", () => {
        const mockSetPage = jest.fn((number: number) => number);
        const page = 1;
        const numPages = 3;

        render(
            <PageIndicator
                page={page}
                setPage={mockSetPage}
                numPages={numPages}
            />
        );

        // show some form of page/numPages
        expect(
            screen.getByText(new RegExp(`${page}.*/.*${numPages}`))
        ).toBeInTheDocument();
    });

    it("should disable left arrow if page is (minimum) 1", () => {
        const mockSetPage = jest.fn((number: number) => number);
        const page = 1;

        render(
            <PageIndicator page={page} setPage={mockSetPage} numPages={4} />
        );

        const leftArrow = screen.getAllByRole("button")[0];
        expect(leftArrow).toBeDisabled();
    });

    it("should disable right arrow if page is equal to max (total pages)", () => {
        const mockSetPage = jest.fn((number: number) => number);
        const page = 3;

        render(
            <PageIndicator page={page} setPage={mockSetPage} numPages={3} />
        );

        const rightArrow = screen.getAllByRole("button")[1];
        expect(rightArrow).toBeDisabled();
    });

    it("should call setPage prop with previous page if left arrow clicked", async () => {
        const mockSetPage = jest.fn((number: number) => number);
        const page = 2;

        render(
            <PageIndicator page={page} setPage={mockSetPage} numPages={3} />
        );

        const leftArrow = screen.getAllByRole("button")[0];
        const user = userEvent.setup();

        await user.click(leftArrow);

        expect(mockSetPage).toBeCalled();
    });

    it("should call setPage prop with next page if right arrow clicked", async () => {
        const mockSetPage = jest.fn((number: number) => number);
        const page = 2;

        render(
            <PageIndicator page={page} setPage={mockSetPage} numPages={3} />
        );

        const rightArrow = screen.getAllByRole("button")[1];
        const user = userEvent.setup();

        await user.click(rightArrow);

        expect(mockSetPage).toBeCalled();
    });
});

import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ReviewsGrid from "../../../../src/components/features/reviews/ReviewsGrid";

describe("ReviewsGrid", () => {
    // clear dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render 'no reviews' text if no reviews", () => {
        render(<ReviewsGrid reviewIDs={[]} />);

        expect(screen.getByText(/no reviews/i));
    });
});

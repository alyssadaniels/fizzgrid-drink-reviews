import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import DrinkImageCarousel from "../../../../src/components/features/drinks/DrinkImageCarousel";

describe("DrinkImageCarousel", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render placeholder if no images", () => {
        render(<DrinkImageCarousel images={[]}/>);

        expect(screen.queryByText(/no images/i));
    })
});

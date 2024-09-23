import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import DrinksContainer from "../../../../src/components/features/drinks/DrinksContainer";

describe("DrinksContainer", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render placeholder if no drinks", () => {
        render(<DrinksContainer drinkIDs={[]}/>);

        expect(screen.queryByText(/no drinks/i));
    })
});

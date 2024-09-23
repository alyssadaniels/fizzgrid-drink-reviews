import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";

import UsersContainer from "../../../../src/components/features/profiles/UsersContainer";

describe("UsersContainer", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render message when no users provided", () => {
        render(<UsersContainer userIDs={[]} />);

        expect(screen.getByText(/no users/i));
    });
});

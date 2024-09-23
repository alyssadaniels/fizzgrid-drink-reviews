import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";

import ProfilePicture from "../../../../src/components/features/profiles/ProfilePicture";
import { PROFILE_PLACEHOLDER_URL } from "../../../../src/util/constants";

describe("ProfilePicture", () => {
    it("should render placeholder if no image is provided", () => {
        render(<ProfilePicture imageURL="" />);

        expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            PROFILE_PLACEHOLDER_URL
        );
    });

    it("should render provided image", () => {
        render(<ProfilePicture imageURL="/test-image.png" />);

        expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            "/test-image.png"
        );
    });
});

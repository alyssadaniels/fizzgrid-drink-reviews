import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";
import ProfileImageInput from "../../../../src/components/common/ui/ProfileImageInput";
import { PROFILE_PLACEHOLDER_URL } from "../../../../src/util/constants";

describe("ProfileImageInput", () => {
    const placeholderImg = "placeholder.png";

    // placeholder, jsdom does not have URL.createObjectURL
    URL.createObjectURL = jest.fn((blob: Blob) => {
        return placeholderImg;
    });

    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should show profile placeholder if no default image provided", () => {
        render(<ProfileImageInput label="profile" />);

        const image: HTMLImageElement = screen.getByRole("img");

        // TODO is there a better way to do this
        // image.src gets full path, PROFILE_PLACEHOLDER_URL is path from public folder
        expect(image.src).toContain(PROFILE_PLACEHOLDER_URL);
    });

    it("should render provided default image", () => {
        render(<ProfileImageInput label="profile" defaultImageURL={placeholderImg}/>);

        const image: HTMLImageElement = screen.getByRole("img");

        expect(image.src).toContain(placeholderImg);
    });

    it("should render inputted image file", async () => {
        render(<ProfileImageInput label="profile" />);

        const user = userEvent.setup();
        const input = screen.getByLabelText("profile");
        const imageFile = new File([], placeholderImg);

        await user.upload(input, imageFile);

        const image: HTMLImageElement = screen.getByRole("img");
        expect(image.src).toContain(placeholderImg);
        expect(URL.createObjectURL).toBeCalled();
    });

    it("should show default image when uploaded file is removed", async () => {
        render(<ProfileImageInput label="profile" />);

        const user = userEvent.setup();
        const input = screen.getByLabelText("profile");
        const imageFile = new File([], placeholderImg);

        await user.upload(input, imageFile);

        fireEvent.change(input, { target: { files: [] } });
        const image: HTMLImageElement = screen.getByRole("img");
        expect(image.src).toContain(PROFILE_PLACEHOLDER_URL);
    });
});

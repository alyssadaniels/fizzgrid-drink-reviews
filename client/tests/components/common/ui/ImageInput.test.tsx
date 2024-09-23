import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import jest from "jest-mock";

import ImageInput from "../../../../src/components/common/ui/ImageInput";

describe("ImageInput", () => {
    const placeholderImg = "placeholder.png";

    // placeholder, jsdom does not have URL.createObjectURL
    URL.createObjectURL = jest.fn((blob: Blob) => {
        return placeholderImg;
    });

    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should not render an image on mount", () => {
        render(<ImageInput />);

        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should render inputted image file", async () => {
        render(<ImageInput />);

        const user = userEvent.setup();
        const input = screen.getByLabelText(/image/i);
        const imageFile = new File([], placeholderImg);

        await user.upload(input, imageFile);

        const image: HTMLImageElement = screen.getByRole("img");
        expect(image.src).toContain(placeholderImg);
        expect(URL.createObjectURL).toBeCalled();
    });

    it("should reject non image files", async () => {
        render(<ImageInput />);

        const user = userEvent.setup();
        const input = screen.getByLabelText(/image/i);
        const nonImageFile = new File([], "placeholder.txt");

        await user.upload(input, nonImageFile);

        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should not render image when image is removed from input", async () => {
        render(<ImageInput />);

        const user = userEvent.setup();
        const input = screen.getByLabelText(/image/i);
        const imageFile = new File([], placeholderImg);

        await user.upload(input, imageFile);
        expect(screen.queryByRole("img")).toBeInTheDocument();

        fireEvent.change(input, { target: { files: [] } });
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
});

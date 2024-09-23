import React from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { queryByText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import Carousel from "../../../../src/components/common/layouts/Carousel";

describe("Carousel", () => {
    // reset dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render first child with arrows", () => {
        const children = [
            <p key="1">Item 1</p>,
            <h1 key="2">Item 2</h1>,
            <div key="3">Item 3</div>,
        ];

        render(<Carousel>{children}</Carousel>);

        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBe(2);

        const displayContainer = screen.getByTestId("display");
        expect(queryByText(displayContainer, "Item 1")).toBeInTheDocument();
        expect(queryByText(displayContainer, "Item 2")).not.toBeInTheDocument();
        expect(queryByText(displayContainer, "Item 2")).not.toBeInTheDocument();
    });

    it("should not render if there are no children", () => {
        const { container: emptyArrContainer } = render(
            <Carousel>{[]}</Carousel>
        );
        expect(emptyArrContainer).toBeEmptyDOMElement();

        const { container: noChildrenContainer } = render(<Carousel />);
        expect(noChildrenContainer).toBeEmptyDOMElement();
    });

    it("should not render arrows if there is one child", async () => {
        const children = [<p key="1">Item 1</p>];

        render(<Carousel>{children}</Carousel>);

        const buttons = screen.queryAllByRole("button");
        expect(buttons.length).toBe(0);

        const displayContainer = screen.getByTestId("display");
        expect(queryByText(displayContainer, "Item 1")).toBeInTheDocument();
    });

    it("should render next child when right arrow is clicked", async () => {
        const children = [
            <div key="1">Item 1</div>,
            <div key="2">Item 2</div>,
            <div key="3">Item 3</div>,
            <div key="4">Item 4</div>,
        ];
        render(<Carousel>{children}</Carousel>);

        const user = userEvent.setup();
        // TODO is there a better way to do this? kind of depends on implementation?
        const rightButton = screen.queryAllByRole("button")[1];

        // click once
        await user.click(rightButton);

        const displayContainer = screen.getByTestId("display");
        expect(queryByText(displayContainer, "Item 1")).not.toBeInTheDocument();
        expect(queryByText(displayContainer, "Item 2")).toBeInTheDocument();
        expect(queryByText(displayContainer, "Item 3")).not.toBeInTheDocument();
        expect(queryByText(displayContainer, "Item 4")).not.toBeInTheDocument();

        // click far enough to cycle
        const numClicks = 10;

        for (let i = 0; i < numClicks; i++) {
            await user.click(rightButton);
        }

        const itemIdx = (numClicks + 1) % children.length;

        for (let i = 0; i < children.length; i++) {
            if (i === itemIdx) {
                expect(
                    queryByText(displayContainer, `Item ${i + 1}`)
                ).toBeInTheDocument();
            } else {
                expect(
                    queryByText(displayContainer, `Item ${i + 1}`)
                ).not.toBeInTheDocument();
            }
        }
    });

    it("should render previous child when left arrow is clicked", async () => {
        const children = [
            <div key="1">Item 1</div>,
            <div key="2">Item 2</div>,
            <div key="3">Item 3</div>,
            <div key="4">Item 4</div>,
        ];
        render(<Carousel>{children}</Carousel>);

        const user = userEvent.setup();
        const leftButton = screen.queryAllByRole("button")[0];

        // click once
        await user.click(leftButton);

        const displayContainer = screen.getByTestId("display");
        expect(queryByText(displayContainer, "Item 1")).not.toBeInTheDocument();
        expect(queryByText(displayContainer, "Item 2")).not.toBeInTheDocument();
        expect(queryByText(displayContainer, "Item 3")).not.toBeInTheDocument();
        expect(queryByText(displayContainer, "Item 4")).toBeInTheDocument();

        // click far enough to cycle
        const numClicks = 10;

        for (let i = 0; i < numClicks; i++) {
            await user.click(leftButton);
        }

        const itemIdx = children.length - ((numClicks + 1) % children.length);

        for (let i = 0; i < children.length; i++) {
            if (i === itemIdx) {
                expect(
                    queryByText(displayContainer, `Item ${i + 1}`)
                ).toBeInTheDocument();
            } else {
                expect(
                    queryByText(displayContainer, `Item ${i + 1}`)
                ).not.toBeInTheDocument();
            }
        }
    });
});

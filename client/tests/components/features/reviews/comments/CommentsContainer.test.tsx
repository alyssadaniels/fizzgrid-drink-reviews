import React, { act } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { getByRole, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import CommentsContainer from "../../../../../src/components/features/reviews/comments/CommentsContainer";
import jest from "jest-mock";
import { reviewComments } from "../../../../mocks/data";
import { queryClientWrapper } from "../../../../queryClientWrapper";

describe("CommentsContainer", () => {
    // clear dom before each test
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render 'no comments' if no comments", () => {
        render(
            queryClientWrapper({
                children: <CommentsContainer comments={[]} />,
            })
        );

        expect(screen.getByText(/no comments/i));
    });

    it("should render comments", () => {
        render(
            queryClientWrapper({
                children: <CommentsContainer comments={reviewComments} />,
            })
        );

        reviewComments.forEach((comment) => {
            expect(screen.getByText(comment.comment_text));
        });
    });
});

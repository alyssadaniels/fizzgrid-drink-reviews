import { beforeEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavMenuItems from "../../../../src/components/common/navigation/NavMenuItems";
import React from "react";
import { API_URL } from "../../../../src/util/constants";
import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/worker";
import { queryClientWrapper } from "../../../queryClientWrapper";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

describe("NavMenuItems", () => {
    const items = [
        {
            label: "example 1",
            url: "/example1",
        },
        {
            label: "example 2",
            url: "/example2",
        },
        {
            label: "example 3",
            url: "/example3",
        },
        {
            label: "example 4",
            url: "/example4",
        },
    ];

    function renderMenuItems() {
        render(
            queryClientWrapper({
                children: <NavMenuItems menuItems={items} />,
            }),
            { wrapper: BrowserRouter }
        );
    }

    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render menu item props as links", () => {
        renderMenuItems();

        const renderedLinks = screen.getAllByRole("link");

        for (let i = 0; i < items.length; i++) {
            expect(renderedLinks[i]).toHaveTextContent(items[i].label);
            expect(renderedLinks[i]).toHaveAttribute("href", items[i].url);
        }
    });

    it("should show 'login' if no user", () => {
        // force no user
        server.use(
            http.get(
                `${API_URL}/profiles/profile`,
                () => {
                    return new HttpResponse("error", { status: 404 });
                },
                { once: true }
            )
        );

        renderMenuItems();

        expect(screen.getByText(/log in/i));
        expect(screen.queryByText(/log out/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
    });

    it("should navigate to login page when 'login' clicked", async () => {
        // force no user
        server.use(
            http.get(
                `${API_URL}/profiles/profile`,
                () => {
                    return new HttpResponse("error", { status: 404 });
                },
                { once: true }
            )
        );

        renderMenuItems();

        const loginLink = screen.getByText(/log in/i);

        const user = userEvent.setup();

        await act(() => user.click(loginLink));

        expect(window.location.href).toMatch("/login");
    });

    it("should show 'profile' and 'logout' if user", () => {});

    it("should navigate to profile page when 'profile' clicked", () => {});

    it("should logout and navigate to home when 'logout' clicked", () => {});
});

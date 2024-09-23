import { useState } from "react";
import { HamburgerIcon, LogoIcon, XIcon } from "../icons";
import NavMenuItems from "./NavMenuItems";
import { Link } from "react-router-dom";

// website pages
const PAGES = [
    { label: "Drinks", url: "/drinks" },
    { label: "Explore", url: "/explore" },
    { label: "Users", url: "/users" },
];

/**
 * Responsive navigation bar component
 * @returns Navigation component
 */
function Navigation() {
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

    /**
     * Toggle mobile menu
     */
    function toggleOpen() {
        setIsMobileOpen(!isMobileOpen);
    }

    return (
        <nav>
            <div className="fixed z-50 top-0 w-screen">
                <div className="flex bg-text-primary items-center justify-around text-sm">
                    {/* logo */}
                    <Link to="/" className="flex items-center p-2">
                        <LogoIcon />

                        <h1 className="font-bold text-background-light text-xl p-2">
                            fizzgrid
                        </h1>
                    </Link>

                    {/* pages (desktop) */}
                    <ul className="gap-6 hidden items-center lg:flex">
                        <NavMenuItems menuItems={PAGES} />
                    </ul>

                    {/* hamburger (mobile) */}
                    <button
                        className="text-background-light  lg:hidden"
                        onClick={toggleOpen}
                    >
                        {/* hamburger icon */}
                        <div className={isMobileOpen ? "hidden" : "block"}>
                            <HamburgerIcon />
                        </div>

                        {/* x icon */}
                        <div className={isMobileOpen ? "block" : "hidden"}>
                            <XIcon />
                        </div>
                    </button>
                </div>

                {/* pages (mobile) */}
                <ul
                    className={`w-full h-screen bg-text-primary text-center py-4 flex flex-col gap-y-4 ${
                        isMobileOpen ? "block" : "hidden"
                    } lg:hidden`}
                >
                    <NavMenuItems menuItems={PAGES} />
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;

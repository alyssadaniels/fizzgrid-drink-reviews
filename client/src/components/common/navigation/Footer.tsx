import { Link } from "react-router-dom";
import { LogoIcon } from "../icons";
import TextButton from "../ui/TextButton";
import { useContext } from "react";
import { ModalContext } from "../../../util/contexts";

/**
 * Footer component
 * @returns Footer component
 */
function Footer() {
    const modalContext = useContext(ModalContext);
    const LINKS = [
        {
            label: "Report a problem",
            onClick: () => {
                modalContext.setShowIssueModal(true);
            },
        },
        {
            label: "Add to drink database",
            onClick: () => {
                modalContext.setShowAddDrinkModal(true);
            },
        },
    ];

    return (
        <nav className="overflow-x-hidden sticky top-[100vh]">
            <div className="w-screen bg-text-primary flex justify-center items-center gap-6 py-4">
                {/* logo */}
                <div>
                    <Link to="/" className="flex items-center p-2">
                        <LogoIcon />

                        <h1 className="font-bold text-background-light text-xl p-2">
                            fizzgrid
                        </h1>
                    </Link>
                </div>

                {/* actions/links */}
                <div className="flex flex-col gap-2 items-start">
                    {LINKS.map((link, index) => (
                        <TextButton
                            text={link.label}
                            key={index}
                            onClick={link.onClick}
                        />
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default Footer;

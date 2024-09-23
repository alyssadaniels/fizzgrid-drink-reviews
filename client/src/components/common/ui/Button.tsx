import { MouseEventHandler } from "react";

interface ButtonProps {
    text: string;
    onClick: MouseEventHandler;
    isPrimary: boolean;
}

/**
 * Button component
 * @param text Text to be displayed on button
 * @param onClick Function defining click behavior
 * @param isPrimary Defines color scheme, if true use primary color scheme, if false use secondary
 * @returns Button component
 */
function Button(props: ButtonProps) {
    return (
        <button
            onClick={props.onClick}
            className={`text-background-light px-6 py-2 rounded-md ${
                props.isPrimary
                    ? "bg-highlight-light hover:bg-highlight-dark"
                    : "bg-background-dark hover:bg-text-primary"
            }`}
        >
            {props.text}
        </button>
    );
}

export default Button;

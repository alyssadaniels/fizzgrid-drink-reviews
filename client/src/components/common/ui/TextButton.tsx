interface TextButtonProps {
    text: string;
    onClick: Function;
    isPrimary?: boolean;
}

/**
 * Text button component
 * Shows button as text
 * @param text Text to be displayed on button
 * @param onClick Function defining click behavior
 * @param isPrimary Defines color scheme, if true use primary color scheme, if false use secondary. Default true
 * @returns TextButton component
 */

function TextButton({ text, onClick, isPrimary = true }: TextButtonProps) {
    return (
        <button
            className={`${
                isPrimary
                    ? "text-background-light hover:underline"
                    : "text-background-dark underline hover:text-highlight-light"
            }`}
            onClick={() => {
                onClick();
            }}
        >
            {text}
        </button>
    );
}

export default TextButton;

import { useState } from "react";

interface TypedInputProps {
    label: string;
    placeholder: string;
    maxLength: number;
    id: string;
    showMaxLength: boolean;
    showCharacters: boolean;
    isRequired?: boolean;
}

/**
 * Typed input component for forms
 * @param label label for input
 * @param placeholder input placeholder text
 * @param maxLength input max length
 * @param id input id
 * @param showMaxLength show max length
 * @param showCharacters show characters
 * @param isRequired input is required
 * @returns TypedInput component
 */
function TypedInput({
    label,
    placeholder,
    maxLength,
    id,
    showCharacters,
    showMaxLength,
    isRequired = true,
}: TypedInputProps) {
    const [inputLength, setInputLength] = useState(0);

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-end justify-between gap-4">
                {/* label */}
                <label htmlFor={id}>{label}</label>

                {/* display number of typed characters */}
                {showMaxLength && (
                    <p className="text-background-dark">
                        {inputLength}/{maxLength}
                    </p>
                )}
            </div>

            {/* input box */}
            <input
                id={id}
                className="py-1 px-2 rounded border w-full bg-highlight-secondary"
                type={showCharacters ? "text" : "password"}
                placeholder={placeholder}
                maxLength={maxLength}
                name={id}
                onChange={(event) => {
                    setInputLength(event.target.value.length);
                }}
                required={isRequired}
                autoComplete="off"
            />
        </div>
    );
}

export default TypedInput;

import { useState } from "react";

interface TypedInputMultiProps {
    label: string;
    placeholder: string;
    maxLength: number;
    id: string;
    showMaxLength: boolean;
    isRequired?: boolean;
}

/**
 * Multiline typed input component for forms
 * @param label label for input
 * @param placeholder input placeholder text
 * @param maxLength input max length
 * @param id input id
 * @param showMaxLength show max length
 * @returns TypedInputMulti component
 */
function TypedInputMulti({
    label,
    placeholder,
    maxLength,
    id,
    showMaxLength,
    isRequired = true,
}: TypedInputMultiProps) {
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
            <textarea
                id={id}
                className="py-1 px-2 rounded border w-full h-48 bg-highlight-secondary"
                placeholder={placeholder}
                maxLength={maxLength}
                onChange={(event) => {
                    setInputLength(event.target.value.length);
                }}
                required={isRequired}
            />
        </div>
    );
}

export default TypedInputMulti;

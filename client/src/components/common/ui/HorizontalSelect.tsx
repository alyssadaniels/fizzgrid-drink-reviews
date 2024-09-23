import { useState } from "react";

/**
 * @property label - label for options/text to show
 * @property setData - function to call when option is selected
 */
interface SelectOption {
    label: string;
    setData(): void;
}

interface HorizontalSelectProps {
    selectOptions: SelectOption[];
}

/**
 * Select menu layed out horizontally
 * Parent controls what happens on selection via setData method in each SelectOption
 * @param selectOption options to select
 * @returns HorizontalSelect component
 */
function HorizontalSelect(props: HorizontalSelectProps) {
    const [selected, setSelected] = useState<string>("0");

    return (
        <div className="flex flex-row gap-4">
            {props.selectOptions.map((option, index) => (
                <div
                    className="text-lg hover:underline hover:cursor-pointer"
                    key={index}
                >
                    <label
                        className={`${
                            selected === index.toString() ? "font-bold" : ""
                        } hover:cursor-pointer`}
                        htmlFor={index.toString()}
                    >
                        {option.label}
                    </label>
                    <input
                        className="hidden"
                        id={index.toString()}
                        type="radio"
                        name="selectOptions"
                        onChange={(event) => {
                            option.setData();
                            setSelected(event.currentTarget.id);
                        }}
                        checked={selected === index.toString()}
                    />
                </div>
            ))}
        </div>
    );
}

export default HorizontalSelect;

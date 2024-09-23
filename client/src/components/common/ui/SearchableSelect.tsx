import { ReactNode, useState } from "react";

interface SearchableSelectProps<T extends { value: number }> {
    placeholder: string;
    options: T[];
    optionFormatter(option: T): ReactNode;
    setData(state: any): void;
    dataResetValue: any;
    onInputChange(input: string): any;
}

/**
 * Searchable selection menu
 * @param placeholder placeholder text for input
 * @param options options to be displayed
 * @param optionFormatter format for option
 * @param setData function to set state for reading
 * @param dataResetValue value to reset data to when input is reset
 * @param onInputChange function to call when input changes
 * @returns SearchableSelect component
 */
function SearchableSelect<T extends { value: number }>(
    props: SearchableSelectProps<T>
) {
    const [openOptions, setOpenOptions] = useState(false);
    const [selected, setSelected] = useState<ReactNode>();

    return (
        <div className="bg-highlight-secondary w-full hover:cursor-pointer">
            <div
                onClick={() => {
                    setOpenOptions(true);
                    setSelected(undefined);
                    props.setData(props.dataResetValue);
                }}
            >
                {selected ? (
                    <div className="shadow w-fit">{selected}</div>
                ) : (
                    <input
                        className="w-full py-1 px-2 rounded border"
                        placeholder={props.placeholder}
                        onChange={(event) =>
                            props.onInputChange(event.currentTarget.value)
                        }
                    />
                )}
            </div>

            <div className="max-h-72 overflow-y-scroll w-full">
                {openOptions && props.options.map((option: T) => (
                    <div key={option.value}>
                        <input
                            hidden
                            type="radio"
                            name="searchableSelect"
                            id={option.value.toString()}
                            value={option.value.toString()}
                            onChange={(event) => {
                                props.setData(
                                    parseInt(event.currentTarget.value)
                                );
                                setOpenOptions(false);
                                setSelected(props.optionFormatter(option));
                            }}
                        />
                        <label htmlFor={option.value.toString()}>
                            {props.optionFormatter(option)}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchableSelect;

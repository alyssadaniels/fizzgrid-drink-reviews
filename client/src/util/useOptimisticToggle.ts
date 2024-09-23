import { useState } from "react";

/**
 * Optimistic toggle
 * Anticipates the boolean value of an async request
 * @param toggleFunction function that sets the value via request
 * @param getIsPending function to calculate if the toggle is in a pending state
 * @param getValue function to calculate true value
 * @returns toggleVal - boolean value of toggle
 * @returns toggle - function to trigger
 */
export default function useOptimisticToggle({
    toggleFunction,
    getIsPending,
    getValue,
}: {
    toggleFunction(currentState: boolean): any;
    getIsPending(): boolean;
    getValue(): boolean;
}): [boolean, () => void] {
    const [tempVal, setTempVal] = useState<boolean>(getValue());

    function toggle(): void {
        // temp val is updated immediately
        setTempVal(false);

        // request value change
        toggleFunction(getValue());
    }

    // if pending, toggleVal should be temp val, otherwise actual value
    let toggleVal;

    if (getIsPending()) {
        toggleVal = tempVal;
    } else {
        toggleVal = getValue();
    }

    return [toggleVal, toggle];
}

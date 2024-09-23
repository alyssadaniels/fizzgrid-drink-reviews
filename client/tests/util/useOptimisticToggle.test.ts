import { it, describe, expect, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import useOptimisticToggle from "../../src/util/useOptimisticToggle";
import jest from "jest-mock";

describe("useOptimisticToggle", () => {
    it("should return result of getValue() if getIsPending() is false", () => {
        const { result } = renderHook(useOptimisticToggle, {
            initialProps: {
                toggleFunction: () => {},
                getIsPending: () => false,
                getValue: () => true,
            },
        });

        const toggleVal = result.current[0];

        expect(toggleVal).toBeTruthy();
    });

    it("should call toggleFunction return a temporary (anticipated) value when toggle is called", async () => {
        const toggleFunc = jest.fn((currentState) => !currentState);

        const { result } = renderHook(() =>
            useOptimisticToggle({
                toggleFunction: toggleFunc,
                getIsPending: () => true,
                getValue: () => true,
            })
        );

        const toggle = result.current[1];

        act(() => toggle());

        expect(toggleFunc).toBeCalled();

        const toggleVal = result.current[0];
        expect(toggleVal).toBeFalsy();
    });
});

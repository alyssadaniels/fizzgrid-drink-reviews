import { it, describe, expect } from "vitest";
import { getArrAvg, getNRandom, xInRange } from "../../src/util/functions";

describe("getNRandom", () => {
    it("should return given array when N > array length", () => {
        const arr = [1, 2, 3];
        const N = 5;

        expect(getNRandom(arr, N)).toBe(arr);
    });

    it("should throw RangeError if N < 1", () => {
        const arr = [1, 2, 3];
        const N = 0;

        expect(() => getNRandom(arr, N)).toThrowError(RangeError);
    });

    it("should return N elements without modifying the original array", () => {
        const arr = [1, 2, 3, 4];
        const N = 3;

        const result = getNRandom(arr, N);

        expect(result.length).toBe(3);
        expect(arr).toStrictEqual([1, 2, 3, 4]);

        result.map((item) => {
            expect(arr).toContain(item);
        });

        const result_items: number[] = [];
        for (let i = 0; i < result.length; i++) {
            expect(result_items).not.toContain(result[i]);

            result_items.push(result[i]);
        }
    });
});

describe("xInRange", () => {
    it("should throw RangeError if min > max", () => {
        expect(() => {
            xInRange(12, 14, 10);
        }).toThrowError(RangeError);
    });

    it("should return true if x = min = max", () => {
        expect(xInRange(3, 3, 3)).toBeTruthy();
    });

    it("should return true if x in range", () => {
        expect(xInRange(-4, -10, 5)).toBeTruthy();
    });

    it("should return false if x out of range", () => {
        expect(xInRange(20, 0, 3)).toBeFalsy();
    });
});

describe("getArrAvg", () => {
    it("should return 0 if arr is empty", () => {
        expect(getArrAvg([], "anything")).toBe(0);
    });

    it("should return 0 if property has no matches", () => {
        const arr = [
            {
                property1: 20,
                property2: -2,
            },
            {
                property1: 18,
                property2: 5,
            },
            {
                property1: -3,
                property2: -67,
            },
        ];

        expect(getArrAvg(arr, "property3")).toBe(0);
    });

    it("should return average of property", () => {
        const arr = [
            {
                property1: 10,
                property2: -235,
            },
            {
                property1: 934,
                property2: -74,
            },
            {
                property1: 5,
                property2: 12,
            },
        ];

        expect(getArrAvg(arr, "property1")).toBeCloseTo(316.333333333);
    });

    it("should return average of property, ignoring non matches", () => {
        const arr = [
            {
                property1: -47,
                property2: -535,
            },
            {
                property2: 200,
            },
            {
                property1: 432,
                property2: -9,
            },
        ];

        expect(getArrAvg(arr, "property1")).toBe(192.5);
    });

    it("should throw TypeError if property can not be converted to a number", () => {
        const arr = [
            {
                property1: 10,
                property2: -235,
            },
            {
                property1: "invalid",
                property2: -74,
            },
            {
                property1: 5,
                property2: 12,
            },
        ];

        expect(() => {
            getArrAvg(arr, "property1");
        }).toThrowError(TypeError);
    });
});

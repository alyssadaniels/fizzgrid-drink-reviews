/**
 * Gets a given number of random elements from a given array
 * @param arr array to get elements from
 * @param N how many elements to get
 * @returns Array of N random elements from arr. If N > arr.length, return arr
 */
export function getNRandom<T>(arr: T[], N: number): any[] {
    if (N < 1) {
        throw new RangeError("N must be > 0");
    }

    if (N > arr.length) {
        return arr;
    }

    // copy array
    const arrCopy = Array.from(arr);

    const resultArr: T[] = [];

    while (resultArr.length < N) {
        // choose idx
        const idx: number = Math.floor(Math.random() * arrCopy.length);

        // add to result
        resultArr.push(arrCopy[idx]);

        // remove from original
        arrCopy.splice(idx, 1);
    }

    return resultArr;
}

/**
 * Checks if given value is in given range (inclusive)
 * @param x number to check is in range
 * @param min minimum range value
 * @param max maximum range value
 * @returns boolean indicating if x is between min and max
 */
export function xInRange(x: number, min: number, max: number): boolean {
    if (min > max) {
        throw new RangeError("min must be less than max");
    }

    return x >= min && x <= max;
}

/**
 * Calculates the average of the given property of an array of objects
 * Will ignore objects in arr that do not have property
 * @param arr array to use
 * @param property name of property to get average of
 * @returns average of property of objects in array
 */
export function getArrAvg(arr: any[], property: string): number {
    if (arr.length === 0) {
        return 0;
    }

    let sum = 0;
    let numItems = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][property] && typeof arr[i][property] != "number") {
            throw new TypeError("property must be number");
        }

        if (arr[i][property]) {
            sum += arr[i][property];
            numItems += 1;
        }
    }

    if (numItems === 0) {
        return 0;
    }

    return sum / numItems;
}

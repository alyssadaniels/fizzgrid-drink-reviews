import jest from "jest-mock";
import { afterAll, afterEach, beforeEach } from "vitest";
import * as fetchWithCredentials from "../src/api-hooks/actions/fetchWithCredentials";
import { server } from "./mocks/worker";

// make sure no tests are using actual fetch functions
// const unmockedFetch = global.fetch;

// allow fetchWithCredentials to be overwritten
Object.defineProperty(fetchWithCredentials, "default", {
    value: jest.fn(),
    configurable: true,
    writable: true,
});

beforeEach(() => {
    server.listen();
    // actual implementation of fetchWithCredentials throws error when no CSRF is found, meaning that it will not succeed in testing env.
    /*
    jest.spyOn(fetchWithCredentials, "default").mockImplementation(
        (url, method, body) => {
            // send body as form data
            const headers = {};

            if (body) headers["Content-Type"] = "multipart/form-data";

            return fetch(`${url}`, {
                method: method,
                headers: headers,
                credentials: "include",
                body: body,
            });
        }
    );
    */
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// TODO this workaround does not seem to be working (trying to resolve current testing environment is not configured to support act)
global.IS_REACT_ACT_ENVIRONMENT = true;

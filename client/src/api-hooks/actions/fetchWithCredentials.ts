import Cookies from "universal-cookie";

export default async function fetchWithCredentials(
    url: string,
    method: string,
    body?: FormData
): Promise<Response> {
    if (!["POST", "DELETE", "PUT", "GET"].includes(method)) {
        throw new SyntaxError("Method invalid");
    }

    // const csrfResponse = await fetch(`${API_URL}/csrf/`);
    // const csrf = csrfResponse.headers.get("X-CSRFToken");

    // TODO figure out how you're actually supposed to do this
    const cookies = new Cookies(null, { path: "/" });
    const csrf = cookies.get("csrftoken");

    if (!csrf) {
        throw new Error("Could not retrieve csrf");
    }

    const headers: { "X-CSRFToken": string; "Content-Type"?: string } = {
        "X-CSRFToken": csrf,
    };

    // send body as form data
    if (body) headers["Content-Type"] = "multipart/form-data";

    return await fetch(`${url}`, {
        method: method,
        headers: headers,
        credentials: "include",
        body: body,
    });
}

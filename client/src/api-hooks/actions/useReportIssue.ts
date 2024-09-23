import { useMutation } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";

async function fetchReportIssue({
    summary,
    details,
    email,
}: {
    summary: string;
    details: string;
    email?: string;
}) {
    const formData = new FormData();
    formData.append("summary", summary);
    formData.append("details", details);

    if (email) formData.append("email", email);

    const response = await fetchWithCredentials(
        `${API_URL}/issues/report-issue/`,
        "POST",
        formData
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (json) message = json.detail;

        throw new Error(message);
    }

    return json.detail;
}

export function useReportIssue() {
    const {
        mutate: reportIssue,
        isPending,
        error,
        isSuccess,
    } = useMutation({
        mutationFn: ({
            summary,
            details,
            email,
        }: {
            summary: string;
            details: string;
            email?: string;
        }) =>
            fetchReportIssue({
                summary: summary,
                details: details,
                email: email,
            }),
    });

    return { reportIssue, isPending, error, isSuccess };
}

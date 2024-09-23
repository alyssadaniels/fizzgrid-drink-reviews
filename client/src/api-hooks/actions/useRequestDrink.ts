import { useMutation } from "@tanstack/react-query";
import fetchWithCredentials from "./fetchWithCredentials";
import { API_URL } from "../../util/constants";

async function fetchPostIssue({
    productName,
    brandName,
    image,
    email,
}: {
    productName: string;
    brandName: string;
    image?: File;
    email?: string;
}) {
    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("brand_name", brandName);

    if (image) formData.append("image", image);
    if (email) formData.append("email", email);

    const response = await fetchWithCredentials(
        `${API_URL}/issues/request-drink/`,
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

export function useRequestDrink() {
    const {
        mutate: requestDrink,
        isPending,
        error,
        isSuccess,
    } = useMutation({
        mutationFn: ({
            productName,
            brandName,
            image,
            email,
        }: {
            productName: string;
            brandName: string;
            image?: File;
            email?: string;
        }) =>
            fetchPostIssue({
                productName: productName,
                brandName: brandName,
                image: image,
                email: email,
            }),
    });

    return { requestDrink, isPending, error, isSuccess };
}
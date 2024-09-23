import { useState } from "react";
import { PROFILE_PLACEHOLDER_URL } from "../../../util/constants";

interface ImageInputProps {
    id?: string;
    label: string;
    defaultImageURL?: string;
}

/**
 * Image input
 * @param id id of input, default "image"
 * @param label label for input
 * @param defaultImageURL url of image to show if no file is selected
 * @returns ImageInput component
 */
export default function ProfileImageInput({
    id = "image",
    label,
    defaultImageURL,
}: ImageInputProps) {
    // make sure default image is valid
    const [imagePreviewSrc, setImagePreviewSrc] = useState(
        defaultImageURL ? defaultImageURL : PROFILE_PLACEHOLDER_URL
    );

    return (
        <>
            <label className="text-left" htmlFor={id}>
                {label}
            </label>
            <div className="grid grid-cols-6 gap-4 items-center justify-center">
                <img
                    className="col-span-2 col-start-3 rounded-full shadow aspect-square object-cover"
                    src={imagePreviewSrc}
                />
                <input
                    className="col-span-4 col-start-2 underline text-xs"
                    type="file"
                    id={id}
                    onChange={(event) => {
                        if (
                            event.currentTarget.files &&
                            event.currentTarget.files.length > 0
                        ) {
                            setImagePreviewSrc(
                                URL.createObjectURL(
                                    event.currentTarget.files[0]
                                )
                            );
                        } else {
                            setImagePreviewSrc(
                                defaultImageURL
                                    ? defaultImageURL
                                    : PROFILE_PLACEHOLDER_URL
                            );
                        }
                    }}
                />
            </div>
        </>
    );
}

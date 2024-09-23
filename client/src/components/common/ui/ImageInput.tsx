import { useState } from "react";

export default function ImageInput({ id = "image" }: { id?: string }) {
    const [imagePreviewSrc, setImagePreviewSrc] = useState<string | null>(null);

    return (
        <>
            <label className="w-full text-left" htmlFor={id}>
                Upload an image
            </label>
            <div className="grid grid-cols-6 gap-4 items-center justify-center">
                {imagePreviewSrc && (
                    <img
                        className="col-span-2 col-start-3 shadow max-h-64 object-contain"
                        src={imagePreviewSrc}
                    />
                )}

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
                            setImagePreviewSrc(null);
                        }
                    }}
                    accept=".png, .jpeg, .jpg"
                />
            </div>
        </>
    );
}

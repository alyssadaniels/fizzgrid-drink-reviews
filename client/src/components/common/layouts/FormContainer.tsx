import { EventHandler, ReactNode } from "react";
import { LoadingCircle } from "../icons";
import Button from "../ui/Button";

/**
 * Form layout component
 * @param onSubmit function to call when form is submitted
 * @param onSuccess function to call when request succeeds
 * @returns FormContainer component
 */
function FormContainer({
    children,
    onSubmit,
    formName,
    submitText,
    isLoading,
    errorMessage,
}: {
    children: ReactNode;
    // TODO restrict this typing more?
    onSubmit: EventHandler<any>;
    formName: string;
    submitText: string;
    isLoading: boolean;
    errorMessage: string | undefined | null;
}) {
    return (
        <form
            name={formName}
            className="w-80 flex flex-col gap-6 items-center"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit(event);
            }}
        >
            {children}

            {errorMessage && (
                <p role="alert" className="text-highlight-dark">
                    {errorMessage}
                </p>
            )}

            {isLoading ? (
                /* loading */
                <div className="flex justify-center py-2s">
                    <LoadingCircle />
                </div>
            ) : (
                /* submit */
                <Button text={submitText} onClick={() => {}} isPrimary={true} />
            )}
        </form>
    );
}

export default FormContainer;

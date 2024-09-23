import TypedInput from "../../common/ui/TypedInput";
import LogoHeader from "../../common/LogoHeader";
import FormContainer from "../../common/layouts/FormContainer";
import { useEffect } from "react";
import ImageInput from "../../common/ui/ImageInput";
import { useRequestDrink } from "../../../api-hooks/actions/useRequestDrink";

/**
 * Form for requesting a drink to be added to database
 * @param onSuccess function to call when form submission succeeds
 * @returns AddDrinkForm component
 */
function AddDrinkForm({ onSuccess }: { onSuccess(): void }) {
    const { isPending, requestDrink, error, isSuccess } = useRequestDrink();

    useEffect(() => {
        if (isSuccess) onSuccess();
    }, [isSuccess]);

    return (
        <FormContainer
            submitText="Submit"
            onSubmit={(event) => {
                requestDrink({
                    productName: event.currentTarget.product_name.value,
                    brandName: event.currentTarget.brand_name.value,
                    image: event.currentTarget.image.files[0],
                    email: event.currentTarget.email.value,
                });
            }}
            formName="AddDrinkForm"
            isLoading={isPending}
            errorMessage={error?.message}
        >
            <LogoHeader title="Add a drink" />
            <p className="text-sm text-center mb-4">
                Can't find the drink you are looking for? Submit a request to
                add it to the site.
            </p>

            {/* inputs */}
            <TypedInput
                label="Drink Name"
                placeholder=""
                maxLength={300}
                id="product_name"
                showMaxLength={true}
                showCharacters={true}
            />
            <TypedInput
                label="Brand"
                placeholder=""
                maxLength={300}
                id="brand_name"
                showMaxLength={true}
                showCharacters={true}
            />

            <ImageInput />

            <br />
            <p className="text-sm text-left text-background-dark">
                Get notified when requested drink is approved
            </p>
            <TypedInput
                label="Email (optional)"
                placeholder=""
                maxLength={300}
                id="email"
                showMaxLength={true}
                showCharacters={true}
                isRequired={false}
            />
        </FormContainer>
    );
}

export default AddDrinkForm;

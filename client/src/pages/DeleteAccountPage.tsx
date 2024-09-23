import PageContainer from "../components/common/layouts/PageContainer";
import TypedInput from "../components/common/ui/TypedInput";
import { PASSWORD_MAX_LENGTH } from "../util/constants";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/common/layouts/FormContainer";
import { useEffect } from "react";
import { useFetchDeleteAccount } from "../api-hooks/actions/useDeleteAccount";

function DeleteAccountPage() {
    const navigate = useNavigate();
    const { deleteAccount, isPending, error, isSuccess } =
        useFetchDeleteAccount();

    useEffect(() => {
        if (isSuccess) navigate("/");
    }, [isSuccess]);

    return (
        <PageContainer>
            <div className="flex flex-col items-center">
                <FormContainer
                    formName="deleteAccountForm"
                    submitText="Delete Account"
                    isLoading={isPending}
                    errorMessage={error?.message}
                    onSubmit={(event) => {
                        event.preventDefault();

                        deleteAccount({
                            password: event.currentTarget.password.value,
                            confirmation:
                                event.currentTarget.confirmation.checked,
                        });
                    }}
                >
                    <h1 className="text-xl text-center font-bold">
                        Delete your account
                    </h1>
                    <TypedInput
                        id="password"
                        label="Enter password to delete account"
                        placeholder=""
                        maxLength={PASSWORD_MAX_LENGTH}
                        showMaxLength={false}
                        showCharacters={false}
                    />
                    <div className="inline">
                        <input
                            className="size-4 mr-2"
                            id="confirmation"
                            type="checkbox"
                        />
                        <label htmlFor="confirmation">
                            By checking this box I acknowledge that deleting my
                            account is a permanent action and can not be
                            reversed.
                        </label>
                    </div>
                </FormContainer>
            </div>
        </PageContainer>
    );
}

export default DeleteAccountPage;

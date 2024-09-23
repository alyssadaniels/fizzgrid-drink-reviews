import {
    EMAIL_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    USERNAME_MAX_LENGTH,
} from "../../../util/constants";
import InternalLink from "../../common/ui/InternalLink";
import TypedInput from "../../common/ui/TypedInput";
import ProfileImageInput from "../../common/ui/ProfileImageInput";
import FormContainer from "../../common/layouts/FormContainer";
import { useContext, useEffect } from "react";
import { ModalContext } from "../../../util/contexts";
import { useUpdateProfile } from "../../../api-hooks/actions/useUpdateProfile";
import { useUser } from "../../../api-hooks/actions/useUser";

/**
 * Form for editing profile info
 * @returns EditProfileForm component
 */
function EditProfileForm() {
    const { user } = useUser();
    const { updateProfile, isPending, error, isSuccess } = useUpdateProfile();

    const modalContext = useContext(ModalContext);

    useEffect(() => {
        if (isSuccess) modalContext.setShowProfileModal(false);
    }, [isSuccess]);

    if (!user) {
        return <p>You must be logged in to access this feature</p>;
    }

    return (
        <div>
            <FormContainer
                submitText="Update Profile"
                onSubmit={(event) => {
                    updateProfile({
                        email: event.currentTarget.email.value,
                        username: event.currentTarget.username.value,
                        password: event.currentTarget.password.value,
                        newPassword: event.currentTarget.new_password.value,
                        image: event.currentTarget.image.files[0],
                    });
                }}
                formName="editProfileForm"
                isLoading={isPending}
                errorMessage={error?.message}
            >
                <div className="text-highlight-dark">
                    <TypedInput
                        label="Enter password to authorize changes"
                        placeholder=""
                        maxLength={PASSWORD_MAX_LENGTH}
                        id="password"
                        showCharacters={false}
                        showMaxLength={true}
                    />
                </div>

                <TypedInput
                    label="Email"
                    placeholder={user.email ? user.email : ""}
                    maxLength={EMAIL_MAX_LENGTH}
                    id="email"
                    showCharacters={true}
                    showMaxLength={false}
                    isRequired={false}
                />

                <TypedInput
                    label="Username"
                    placeholder={user.username}
                    maxLength={USERNAME_MAX_LENGTH}
                    id="username"
                    showCharacters={true}
                    showMaxLength={true}
                    isRequired={false}
                />

                <TypedInput
                    label="New Password"
                    placeholder=""
                    maxLength={PASSWORD_MAX_LENGTH}
                    id="new_password"
                    showCharacters={false}
                    showMaxLength={true}
                    isRequired={false}
                />
                <p className="text-sm text-background-dark">
                    Note: Changing password will log you out of all accounts
                </p>

                {/* profile picture */}
                <ProfileImageInput
                    label="Profile Picture"
                    defaultImageURL={user.profile_img}
                />
            </FormContainer>
            <br />

            {/* bottom text */}
            <div className="text-center">
                <InternalLink text="Delete account" to="/delete-account" />
            </div>
        </div>
    );
}

export default EditProfileForm;

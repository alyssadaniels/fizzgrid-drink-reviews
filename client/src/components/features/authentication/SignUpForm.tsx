import { Link, useNavigate } from "react-router-dom";
import { usePostSignUp } from "../../../api-hooks/actions/usePostSignUp";
import { useEffect } from "react";
import LogoHeader from "../../common/LogoHeader";
import FormContainer from "../../common/layouts/FormContainer";
import TypedInput from "../../common/ui/TypedInput";
import {
    EMAIL_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    PROFILE_PLACEHOLDER_URL,
    USERNAME_MAX_LENGTH,
} from "../../../util/constants";
import ProfileImageInput from "../../common/ui/ProfileImageInput";

export default function SignUpForm() {
    const navigate = useNavigate();

    const { data, signUp, error, isPending, isSuccess } = usePostSignUp();

    useEffect(() => {
        if (data && isSuccess) navigate(`/users/${data.id}`);
    }, [isSuccess]);

    return (
        <>
            <LogoHeader title="Sign up" />
            <p className="text-xs text-background-dark">Start reviewing now</p>

            {/* inputs */}
            <FormContainer
                onSubmit={(event) => {
                    signUp({
                        email: event.currentTarget.email.value,
                        username: event.currentTarget.username.value,
                        password: event.currentTarget.password.value,
                        image: event.currentTarget.image.files[0],
                    });
                }}
                formName="signUpForm"
                submitText="Sign up"
                isLoading={isPending}
                errorMessage={error?.message}
            >
                <TypedInput
                    label="Email"
                    placeholder=""
                    maxLength={EMAIL_MAX_LENGTH}
                    id="email"
                    showCharacters={true}
                    showMaxLength={false}
                />
                <TypedInput
                    label="Username"
                    placeholder=""
                    maxLength={USERNAME_MAX_LENGTH}
                    id="username"
                    showCharacters={true}
                    showMaxLength={true}
                />

                <TypedInput
                    label="Password"
                    placeholder=""
                    maxLength={PASSWORD_MAX_LENGTH}
                    id="password"
                    showCharacters={false}
                    showMaxLength={true}
                />

                {/* profile pictures */}
                <ProfileImageInput
                    label="Profile Picture"
                    defaultImageURL={PROFILE_PLACEHOLDER_URL}
                />
            </FormContainer>
            {/* login */}
            <p className="text-xs">
                Have an account already?{" "}
                <Link
                    className="text-highlight-light hover:underline"
                    to="/login"
                >
                    Log in
                </Link>
            </p>
        </>
    );
}

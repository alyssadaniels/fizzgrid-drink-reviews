import {
    PASSWORD_MAX_LENGTH,
    USERNAME_MAX_LENGTH,
} from "../../../util/constants";
import TypedInput from "../../common/ui/TypedInput";
import InternalLink from "../../common/ui/InternalLink";
import LogoHeader from "../../common/LogoHeader";
import FormContainer from "../../common/layouts/FormContainer";
import { useLogin } from "../../../api-hooks/actions/useLogin";

/**
 * Form for logging in
 * @returns LoginForm component
 */
function LoginForm() {
    const { login, error, isPending } = useLogin();

    return (
        <>
            <FormContainer
                onSubmit={(event) => {
                    event.preventDefault();

                    const username = event.currentTarget.username.value;
                    const password = event.currentTarget.password.value;

                    login({ username: username, password: password });
                }}
                formName="loginForm"
                submitText="Log in"
                isLoading={isPending}
                errorMessage={error?.message}
            >
                <LogoHeader title="Log in" />
                {/* inputs */}
                <TypedInput
                    label="Username"
                    placeholder=""
                    maxLength={USERNAME_MAX_LENGTH}
                    id="username"
                    showMaxLength={false}
                    showCharacters={true}
                />
                <TypedInput
                    label="Password"
                    placeholder=""
                    maxLength={PASSWORD_MAX_LENGTH}
                    id="password"
                    showMaxLength={false}
                    showCharacters={false}
                />

                {/* forgot password */}
                {/* <div className="text-xs mx-auto">
          <InternalLink text="Forgot your password?" to="/" />
        </div> */}
            </FormContainer>
            <br />
            {/* bottom text */}
            <p className="text-xs mx-auto text-center">
                Don't have an account?{" "}
                <InternalLink text="Sign up" to={"/signup"} />
            </p>
        </>
    );
}

export default LoginForm;

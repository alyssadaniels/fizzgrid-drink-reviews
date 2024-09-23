import { useNavigate } from "react-router-dom";
import PageContainer from "../components/common/layouts/PageContainer";
import LoginForm from "../components/features/authentication/LoginForm";
import { useUser } from "../api-hooks/actions/useUser";

/**
 * Login page - allows user to login
 * @returns Login page component
 */
function LoginPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    // go to user profile if they are logged in
    if (user) {
        navigate(`/users/${user.id}`);
    }

    return (
        <PageContainer>
            <div className="flex flex-col items-center">
                <LoginForm />
            </div>
        </PageContainer>
    );
}

export default LoginPage;

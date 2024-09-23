import { useNavigate } from "react-router-dom";
import { useUser } from "../api-hooks/actions/useUser";
import PageContainer from "../components/common/layouts/PageContainer";
import SignUpForm from "../components/features/authentication/SignUpForm";

/**
 * Sign up page - Sign up/create an account
 * @returns Sign up page component
 */
function SignUpPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    // go to user profile if they are logged in
    if (user) {
        navigate(`/users/${user.id}`);
    }
    
    return (
        <PageContainer>
            <div className="flex flex-col gap-2 items-center">
                <SignUpForm />
            </div>
        </PageContainer>
    );
}

export default SignUpPage;

import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useEffect } from "react";
import { useUser } from "../../../api-hooks/actions/useUser";
import { useLogout } from "../../../api-hooks/actions/useLogout";

export default function NavMenuItems({
    menuItems,
}: {
    menuItems: { label: string; url: string }[];
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const { user } = useUser();
    const { logout, isSuccess: logoutSuccess } = useLogout();

    useEffect(() => {
        if (logoutSuccess) navigate("/");
    }, [logoutSuccess]);

    return (
        <>
            {menuItems.map((value, idx) => {
                return (
                    <li
                        key={idx}
                        className={`${
                            location.pathname === value.url
                                ? "text-background-light"
                                : "text-background-dark"
                        } hover:text-background-light`}
                    >
                        <Link to={value.url}>{value.label}</Link>
                    </li>
                );
            })}
            {/* login/logout */}
            {user ? (
                <>
                    <li
                        className={`${
                            location.pathname === `/users/${user.id}`
                                ? "text-background-light"
                                : "text-background-dark"
                        } hover:text-background-light`}
                    >
                        <Link to={`/users/${user.id}`}>Profile</Link>
                    </li>
                    <li
                        className="text-background-dark hover:text-background-light hover:cursor-pointer"
                        onClick={() => {
                            logout();
                        }}
                    >
                        Log out
                    </li>
                </>
            ) : (
                <li
                    className={`${
                        location.pathname === "/login"
                            ? "text-background-light"
                            : "text-background-dark"
                    } hover:text-background-light`}
                >
                    <Link to="/login">Log in</Link>
                </li>
            )}
            {/* write a review */}
            <li>
                <Button
                    text="Write a Review"
                    onClick={() => navigate("/write-review")}
                    isPrimary={true}
                />
            </li>
        </>
    );
}

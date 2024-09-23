import LoginForm from "./LoginForm";
import Modal from "../../common/layouts/Modal";
import { useContext } from "react";
import { ModalContext } from "../../../util/contexts";
import { useUser } from "../../../api-hooks/actions/useUser";

function LoginModal() {
    const modalContext = useContext(ModalContext);
    const { user } = useUser();

    if (user) {
        modalContext.setShowLoginModal(false);
    }

    return (
        <Modal setIsShowing={modalContext.setShowLoginModal}>
            <LoginForm />
        </Modal>
    );
}

export default LoginModal;

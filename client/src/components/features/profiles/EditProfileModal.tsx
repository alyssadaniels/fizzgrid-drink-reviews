import { useContext } from "react";
import Modal from "../../common/layouts/Modal";
import EditProfileForm from "./EditProfileForm";
import { ModalContext } from "../../../util/contexts";

/**
 * Edit profile modal
 * @returns EditProfileModal component
 */
function EditProfileModal() {
    const modalContext = useContext(ModalContext);

    return (
        <Modal setIsShowing={modalContext.setShowProfileModal}>
            <EditProfileForm />
        </Modal>
    );
}

export default EditProfileModal;

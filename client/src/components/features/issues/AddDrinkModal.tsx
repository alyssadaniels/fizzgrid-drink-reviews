import { useContext } from "react";
import AddDrinkForm from "./AddDrinkForm";
import Modal from "../../common/layouts/Modal";
import { ModalContext } from "../../../util/contexts";

function AddDrinkModal() {
    const modalContext = useContext(ModalContext);

    return (
        <Modal setIsShowing={modalContext.setShowAddDrinkModal}>
            <AddDrinkForm
                onSuccess={() => {
                    modalContext.setShowAddDrinkModal(false);
                }}
            />
        </Modal>
    );
}

export default AddDrinkModal;

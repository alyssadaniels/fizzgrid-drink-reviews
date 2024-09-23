import ReportIssueForm from "./ReportIssueForm";
import Modal from "../../common/layouts/Modal";
import { useContext } from "react";
import { ModalContext } from "../../../util/contexts";

/**
 * report issue modal
 * @returns ReportIssueModal
 */
function ReportIssueModal() {
    const modalContext = useContext(ModalContext);

    return (
        <Modal setIsShowing={modalContext.setShowIssueModal}>
            <ReportIssueForm
                onSuccess={() => {
                    modalContext.setShowIssueModal(false);
                }}
            />
        </Modal>
    );
}

export default ReportIssueModal;

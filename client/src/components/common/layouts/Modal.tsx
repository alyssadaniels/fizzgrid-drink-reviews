import { ChildrenProps } from "../../../util/types";
import { XIcon } from "../icons";

interface ModalProps extends ChildrenProps {
    setIsShowing(state: boolean): void;
}

/**
 * Modal component
 * Displays shadow over background and shows content in center
 * Opening/closing of modal is controlled by parent
 * @param setIsShowing function to control whether modal is showing
 * @returns Modal component
 */
function Modal(props: ModalProps) {
    return (
        <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-black/30 flex flex-col items-center justify-center">
            <div className="overflow-auto bg-background-light px-20 py-16 mt-20 mb-10">
                {/* X */}
                <div className="text-right">
                    <button
                        className="hover:text-highlight-light"
                        onClick={() => {
                            props.setIsShowing(false);
                        }}
                    >
                        <XIcon />
                    </button>
                </div>

                <br />

                {/* content */}
                {props.children}
            </div>
        </div>
    );
}

export default Modal;

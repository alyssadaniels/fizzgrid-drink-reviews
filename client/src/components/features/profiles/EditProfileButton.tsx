import { useContext } from "react";
import Button from "../../common/ui/Button";
import { ModalContext } from "../../../util/contexts";

/**
 * Edit profile button toggles edit profile modal when clicked
 * @returns EditProfileButton component
 */
function EditProfileButton() {
  const modalContext = useContext(ModalContext);

  return (
      <Button
        text="Edit Profile"
        onClick={(event) => {
          event.preventDefault();

          modalContext.setShowProfileModal(true);
        }}
        isPrimary={false}
      />
  );
}

export default EditProfileButton;

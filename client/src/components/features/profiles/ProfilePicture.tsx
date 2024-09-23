import { PROFILE_PLACEHOLDER_URL } from "../../../util/constants";

/**
 * Profile picture
 * If no picture is found, default/placeholder will show
 * @param imageURL image to show
 * @returns ProfilePicture component
 */
function ProfilePicture({ imageURL }: { imageURL: string }) {
    const src = imageURL && imageURL.length > 0 ? imageURL : PROFILE_PLACEHOLDER_URL;
    return (
        <img
            className="object-cover w-full h-full aspect-square rounded-full shadow"
            src={src}
        />
    );
}

export default ProfilePicture;

import ProfilePicture from "./ProfilePicture";
import EditProfileButton from "./EditProfileButton";
import FollowButton from "./FollowButton";
import {
    LoadingCircle,
    ProfileOutlineIcon,
    WriteIcon,
} from "../../common/icons";
import { MD_ICON_SIZE } from "../../../util/constants";
import ItemCount from "../../common/ui/ItemCount";
import VerticalCard from "../../common/layouts/VerticalCard";
import { useFetchProfile } from "../../../api-hooks/gets/profileHooks";
import { useUser } from "../../../api-hooks/actions/useUser";

/**
 * Card displays summary stats of specified user
 * Clicking component will direct to user's page
 * @param profileID profile id
 * @returns UserCard component
 */
function VerticalProfileCard({ profileID }: { profileID: number }) {
    const { data, isRefetching, isLoading } = useFetchProfile(profileID);
    const { user } = useUser();

    if (isLoading) {
        return (
            <div className="mx-auto w-fit">
                <LoadingCircle />
            </div>
        );
    }

    if (!data) {
        return <></>;
    }

    return (
        <VerticalCard url={`/users/${data.profile.id}`}>
            {/* profile picture */}
            <div className="aspect-square max-w-24 max-h-24">
                <ProfilePicture imageURL={data.profile.profile_img} />
            </div>

            {/* button, if != user - follow button, if == user - edit profile button */}
            {user && user.id == data.profile.id ? (
                <EditProfileButton />
            ) : (
                <FollowButton
                    followingProfile={data}
                    isRefetching={isRefetching}
                />
            )}

            <div className="flex flex-col justify-center">
                {/* username */}
                <p className="inline break-all">{data.profile.username}</p>

                {/* stats */}
                <div className="flex gap-4 text-text-primary text-sm">
                    {/* reviews */}
                    <ItemCount
                        n={data.reviews.reviews.length}
                        icon={<WriteIcon size={MD_ICON_SIZE} />}
                        isVertical={false}
                    />

                    {/* followers */}
                    <ItemCount
                        n={data.followers.length}
                        icon={<ProfileOutlineIcon size={MD_ICON_SIZE} />}
                        isVertical={false}
                    />
                </div>
            </div>
        </VerticalCard>
    );
}

export default VerticalProfileCard;

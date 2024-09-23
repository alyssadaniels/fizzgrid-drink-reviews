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
import HorizontalCard from "../../common/layouts/HorizontalCard";
import { useFetchProfile } from "../../../api-hooks/gets/profileHooks";
import { useUser } from "../../../api-hooks/actions/useUser";

/**
 * Card displays summary stats of specified profile
 * Clicking component will direct to profile's page
 * @param profileID profile id
 * @returns ProfileCard component
 */
function HorizontalProfileCard({ profileID }: { profileID: number }) {
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
        <HorizontalCard url={`/users/${data.profile.id}`}>
            {/* profile picture */}
            <div className="col-span-2 aspect-square max-w-24 max-h-24">
                <ProfilePicture imageURL={data.profile.profile_img} />
            </div>

            <div className="col-span-7 col-start-4 grid grid-rows-2">
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

            {/* button, if != user - follow button, if == user - edit profile button */}
            <div className="col-span-2">
                {user && user.id == data.profile.id ? (
                    <EditProfileButton />
                ) : (
                    <FollowButton
                        followingProfile={data}
                        isRefetching={isRefetching}
                    />
                )}
            </div>
        </HorizontalCard>
    );
}

export default HorizontalProfileCard;

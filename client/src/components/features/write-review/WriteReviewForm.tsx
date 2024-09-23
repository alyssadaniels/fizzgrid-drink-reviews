import { useEffect, useState } from "react";
import { REVIEW_MAX_LENGTH, XL_ICON_SIZE } from "../../../util/constants";
import { StarIcon } from "../../common/icons";
import TypedInputMulti from "../../common/ui/TypedInputMulti";
import SearchableSelect from "../../common/ui/SearchableSelect";
import FormContainer from "../../common/layouts/FormContainer";
import ProfilePicture from "../profiles/ProfilePicture";
import { useNavigate } from "react-router-dom";
import ImageInput from "../../common/ui/ImageInput";
import DrinkOption from "./DrinkOption";
import { useDebounce } from "@uidotdev/usehooks";
import { DrinkImage } from "../../../util/types";
import { useFetchDrinksWithImages } from "../../../api-hooks/gets/drinkHooks";
import { useUser } from "../../../api-hooks/actions/useUser";
import { usePostReview } from "../../../api-hooks/actions/usePostReview";

// rating options for rating stars
const RATING_OPTIONS = [1, 2, 3, 4, 5];

// type of search select options
interface OptionType {
    value: number;
    product_name: string;
    brand_name: string;
    images: DrinkImage[];
}

/**
 * Write review form
 * Note: does not use APIForm since rating and drink ID are set with state, not form elements
 * @returns WriteReviewForm component
 */
function WriteReviewForm() {
    const navigate = useNavigate();

    // number of stars the user has hovered over (not saved when user mouse leaves component)
    const [hoverStars, setHoverStars] = useState(0);

    // number of stars the user has clicked (saved when user mouse leaves component)
    const [numStars, setNumStars] = useState(0);

    // drink selected
    const [drinkID, setDrinkID] = useState(-1);

    // select input
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    // data
    const { data } = useFetchDrinksWithImages(1, debouncedSearch);
    const { user } = useUser();
    const {
        data: review,
        postReview,
        isPending,
        error,
        isSuccess: postSuccess,
    } = usePostReview();

    useEffect(() => {
        if (postSuccess) {
            navigate(`/reviews/${review?.id}`);
        }
    }, [postSuccess]);

    return (
        <FormContainer
            onSubmit={(event) => {
                event.preventDefault();

                postReview({
                    drinkID: drinkID,
                    rating: numStars,
                    reviewText: event.currentTarget.review.value,
                    image: event.currentTarget.image.files[0],
                });
            }}
            formName="writeReview"
            submitText="Submit"
            isLoading={isPending}
            errorMessage={error?.message}
        >
            {/* heading */}
            <div className="w-full flex justify-start items-center gap-4">
                {user && (
                    <div className="size-14">
                        <ProfilePicture imageURL={user.profile_img} />
                    </div>
                )}
                <h2>Write a Review</h2>
            </div>

            <br />
            {/* select drink */}
            <label className="w-full text-left" htmlFor="drink">
                Drink
            </label>
            {data && (
                <SearchableSelect
                    placeholder="Search for drinks..."
                    options={data.drinks.map((drink) => {
                        let option = {
                            value: drink.drink.id,
                            product_name: drink.drink.product_name,
                            brand_name: drink.drink.brand_name,
                            images: drink.images,
                        };

                        return option;
                    })}
                    optionFormatter={(drink: OptionType) => {
                        const drinkAsDrink = {
                            id: drink.value,
                            product_name: drink.product_name,
                            brand_name: drink.brand_name,
                        };
                        
                        return DrinkOption({
                            drink: drinkAsDrink,
                            images: drink.images,
                        });
                    }}
                    setData={setDrinkID}
                    dataResetValue={-1}
                    onInputChange={(input) => {
                        setSearch(input);
                    }}
                />
            )}

            <br />

            {/* upload image */}
            <ImageInput />
            <br />

            {/* rate */}
            <label className="w-full text-left">Rating</label>
            <div className="flex">
                {RATING_OPTIONS.map((option) => {
                    return (
                        <div
                            key={option}
                            className={`${
                                hoverStars >= option
                                    ? "text-highlight-light"
                                    : "text-background-dark"
                            } hover:cursor-pointer`}
                            onMouseEnter={() => {
                                setHoverStars(option);
                            }}
                            onMouseLeave={() => {
                                setHoverStars(numStars);
                            }}
                            onClick={() => {
                                setNumStars(option);
                                console.log(numStars);
                            }}
                        >
                            <input
                                className="hidden"
                                type="radio"
                                value={option}
                                id={`star${option}`}
                            />
                            <label htmlFor={`star${option}`}>
                                <StarIcon size={XL_ICON_SIZE} />
                            </label>
                        </div>
                    );
                })}
            </div>
            <br />

            {/* text */}
            <TypedInputMulti
                label="Review"
                placeholder="Leave your review here. Remember, anyone can see what you write."
                maxLength={REVIEW_MAX_LENGTH}
                id="review"
                showMaxLength={true}
            />
        </FormContainer>
    );
}

export default WriteReviewForm;

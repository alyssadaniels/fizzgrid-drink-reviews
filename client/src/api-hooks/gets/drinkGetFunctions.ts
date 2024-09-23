import { API_URL } from "../../util/constants";
import { Drink, DrinkFavorite, DrinkImage, FetchError } from "../../util/types";

/**
 * Fetch drink with drink id
 * @param drinkID id of drink to get
 * @returns drink data
 */
export async function fetchDrink(drinkID: number): Promise<Drink> {
    // get drink
    const response = await fetch(`${API_URL}/drinks/drink/${drinkID}`);
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    return json as Drink;
}

/**
 * Fetch all drinks function
 * @returns array of drink data
 */
export async function fetchDrinks(
    page = 1,
    search = ""
): Promise<{ drinks: Drink[]; num_pages: number }> {
    const response = await fetch(
        `${API_URL}/drinks/?search=${search}&page=${page}`
    );
    const json = await response.json();

    if (!response.ok) {
        throw new Error((json as FetchError).detail);
    }

    return { drinks: json.drinks, num_pages: json.num_pages };
}

/**
 * Fetch drink favorites
 * @param drinkID id of drink
 * @param profileID id of profile
 * @returns array of DrinkFavorites
 */
export async function fetchDrinkFavorites({
    drinkID,
    profileID,
}: {
    drinkID?: number;
    profileID?: number;
}): Promise<DrinkFavorite[]> {
    // format queries
    let url = `${API_URL}/drinks/favorites/?`;

    if (drinkID != undefined) url += `drink=${drinkID}&`;
    if (profileID != undefined) url += `profile=${profileID}`;

    // request
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    // format
    for (let i = 0; i < json.favorites.length; i++) {
        json.favorites[i].date_created = new Date(
            Date.parse(json.date_created)
        );
    }

    return (json as { favorites: DrinkFavorite[] }).favorites;
}

/**
 * Fetch images for drink id
 * @param drinkID id of drink
 * @returns array of DrinkImages for drinkID
 */
export async function fetchDrinkImages(drinkID: number): Promise<DrinkImage[]> {
    // get drink image
    const response = await fetch(`${API_URL}/drinks/images/?drink=${drinkID}`);
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    return (json as { images: DrinkImage[] }).images;
}

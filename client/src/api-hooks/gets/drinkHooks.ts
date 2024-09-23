import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { Drink, DrinkData, DrinkImage } from "../../util/types";
import {
    fetchDrink,
    fetchDrinkFavorites,
    fetchDrinkImages,
    fetchDrinks,
} from "./drinkGetFunctions";
import { fetchReviews } from "./reviewGetFunctions";

/**
 * Hook to fetch all data for drink
 * @param drinkID drink id to get data for
 * @returns { data, isLoading, drinkError } data, is loading (true if any part is loading), error on fetching drink
 */
export function useFetchDrink(drinkID: number): {
    data: DrinkData | undefined;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
} {
    // get all data related to given drink
    // drink
    const {
        data: drink,
        isLoading: drinkLoading,
        isError: drinkError,
    } = useQuery({
        queryKey: ["drink", drinkID],
        queryFn: () => fetchDrink(drinkID),
    });

    // images
    const {
        data: images,
        isLoading: imagesLoading,
        isError: imagesError,
    } = useQuery({
        queryKey: ["drink", drinkID, "images"],
        queryFn: () => fetchDrinkImages(drinkID),
    });

    // reviews
    const {
        data: reviews,
        isLoading: reviewsLoading,
        isError: reviewsError,
    } = useQuery({
        queryKey: ["drink", drinkID, "reviews"],
        queryFn: () => fetchReviews({ drinkID: drinkID }),
    });

    // favorites
    const {
        data: favorites,
        isLoading: favoritesLoading,
        isError: favoritesError,
        isRefetching,
    } = useQuery({
        queryKey: ["drink", drinkID, "favorites"],
        queryFn: () => fetchDrinkFavorites({ drinkID: drinkID }),
    });

    // format return values, only define data if all data as been fetched
    let data;

    if (drink && images && reviews && favorites) {
        data = {
            drink: drink,
            images: images,
            reviews: reviews,
            favorites: favorites,
        };
    }

    const isLoading =
        drinkLoading || imagesLoading || reviewsLoading || favoritesLoading;
    const isError = drinkError || imagesError || reviewsError || favoritesError;

    return { data, isLoading, isError, isRefetching };
}

/**
 * Hook to fetch all drinks
 * @returns { data, isLoading, drinkError } data, is loading (true if any part is loading), error on fetching any drink
 */
export function useFetchDrinks(
    page = 1,
    search = ""
): {
    data: { drinks: Drink[]; num_pages: number } | undefined;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
} {
    const { data, isLoading, isError, isRefetching } = useQuery({
        queryKey: ["drinks", { page, search }],
        queryFn: () => fetchDrinks(page, search),
        placeholderData: keepPreviousData,
    });

    return { data, isLoading, isError, isRefetching };
}

/**
 * Combine array of useQuery results into a single object
 * @param results array of useQuery results
 * @returns data - data array
 * @returns isLoading - if at least on result is loading
 * @returns isError - if at least one result threw an error
 */
export function combineResults(results: any[]) {
    return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
    };
}

/**
 * Hook to fetch all drinks with images
 * @returns data - Drink data with corresponding DrinkImage
 * @returns isLoading - drinks are loading
 * @returns isError - error fetching drinks
 * @returns isRefetching - drinks are being refetched
 */
export function useFetchDrinksWithImages(
    page = 1,
    search = ""
): {
    data:
        | {
              drinks: { images: DrinkImage[]; drink: Drink }[];
              num_pages: number | undefined;
          }
        | undefined;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
} {
    const {
        data: drinks,
        isLoading,
        isError,
        isRefetching,
    } = useQuery({
        queryKey: ["drinks", { page, search }],
        queryFn: () => fetchDrinks(page, search),
        placeholderData: keepPreviousData,
    });

    // get images
    const images = useQueries({
        queries:
            drinks && drinks.drinks.length > 0
                ? drinks.drinks.map((drink) => {
                      return {
                          queryKey: ["drink", drink.id, "images"],
                          queryFn: () => fetchDrinkImages(drink.id),
                      };
                  })
                : [],
        combine: combineResults,
    });

    // zip results
    const zipped = [];
    if (drinks && images) {
        for (let i = 0; i < drinks.drinks.length; i++) {
            zipped.push({
                drink: drinks.drinks[i],
                images: images.data[i],
            });
        }
    }

    const data = { drinks: zipped, num_pages: drinks?.num_pages };

    return { data, isLoading, isError, isRefetching };
}

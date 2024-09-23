import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { CommentData, ReviewComment, ReviewData } from "../../util/types";
import {
    fetchComment,
    fetchCommentLikes,
    fetchRecentReviews,
    fetchReview,
    fetchReviewComments,
    fetchReviewImages,
    fetchReviewLikes,
} from "./reviewGetFunctions";
import { fetchDrink } from "./drinkGetFunctions";
import { fetchProfile } from "./profileGetFunctions";

/**
 * Hook to fetch review data
 * @param reviewID review id
 * @returns {data, isLoading, isError} review data
 */
export function useFetchReview(reviewID: number): {
    data: ReviewData | undefined;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
} {
    // get all data related to given review
    // review
    const {
        data: review,
        isLoading: reviewLoading,
        isError: reviewError,
    } = useQuery({
        queryKey: ["review", reviewID],
        queryFn: () => fetchReview(reviewID),
    });

    // likes
    const {
        data: likes,
        isLoading: likesLoading,
        isError: likesError,
        isRefetching,
    } = useQuery({
        queryKey: ["review", reviewID, "likes"],
        queryFn: () => fetchReviewLikes(reviewID),
    });

    // images
    const {
        data: images,
        isLoading: imagesLoading,
        isError: imagesError,
    } = useQuery({
        queryKey: ["review", reviewID, "images"],
        queryFn: () => fetchReviewImages(reviewID),
    });

    // drink
    const drinkID = review?.drink_id;

    const {
        data: drink,
        isLoading: drinkLoading,
        isError: drinkError,
    } = useQuery({
        queryKey: ["drink", drinkID],
        queryFn: () => fetchDrink(drinkID !== undefined ? drinkID : -1),
        enabled: drinkID != undefined,
    });

    // profile
    const profileID = review?.profile_id;

    const {
        data: profile,
        isLoading: profileLoading,
        isError: profileError,
    } = useQuery({
        queryKey: ["profile", profileID],
        queryFn: () => fetchProfile(profileID !== undefined ? profileID : -1),
        enabled: profileID != undefined,
    });

    // format, only return data if everything has been populated
    let data;

    if (review && drink && profile && images && likes) {
        data = {
            review: review,
            images: images,
            drink: drink,
            profile: profile,
            likes: likes,
        };
    }

    const isLoading =
        reviewLoading ||
        drinkLoading ||
        profileLoading ||
        likesLoading ||
        imagesLoading;
    const isError =
        reviewError || drinkError || profileError || likesError || imagesError;

    return { data, isLoading, isError, isRefetching };
}

/**
 * Hook to fetch comments for review
 * @param reviewID review id
 * @returns {data, isLoading, isError}
 */
export function useFetchComments(reviewID: number): {
    data: ReviewComment[] | undefined;
    isLoading: boolean;
    isError: boolean;
} {
    // comments
    const { data, isLoading, isError } = useQuery({
        queryKey: ["review", reviewID, "comments"],
        queryFn: () => fetchReviewComments(reviewID),
    });

    return { data, isLoading, isError };
}

export function useFetchComment(commentID: number): {
    data: CommentData | undefined;
    isLoading: boolean;
    isError: boolean;
    isRefetching: boolean;
} {
    // comment
    const {
        data: comment,
        isLoading: commentLoading,
        isError: commentError,
    } = useQuery({
        queryKey: ["comment", commentID],
        queryFn: () => fetchComment(commentID),
    });

    // likes
    const {
        data: likes,
        isLoading: likesLoading,
        isError: likesError,
        isRefetching,
    } = useQuery({
        queryKey: ["comment", commentID, "likes"],
        queryFn: () => fetchCommentLikes(commentID),
    });

    // profile
    const profileID = comment?.profile_id;

    const {
        data: profile,
        isLoading: profileLoading,
        isError: profileError,
    } = useQuery({
        queryKey: ["profile", profileID],
        queryFn: () => fetchProfile(profileID ? profileID : -1),
        enabled: profileID !== undefined,
    });

    // only return data if all data has been resolved
    let data;

    if (comment && likes && profile) {
        data = {
            comment: comment,
            likes: likes,
            profile: profile,
        };
    }

    const isLoading = commentLoading || likesLoading || profileLoading;
    const isError = commentError && likesError && profileError;

    return { data, isLoading, isError, isRefetching };
}

export function useFetchRecentReviews() {
    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["recent-reviews"],
            queryFn: fetchRecentReviews,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialPageParam: 1,
        });

    return { data, isFetchingNextPage, fetchNextPage, hasNextPage };
}

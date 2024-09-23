import { API_URL } from "../../util/constants";
import {
    CommentLike,
    DrinkImage,
    FetchError,
    Review,
    ReviewComment,
    ReviewLike,
} from "../../util/types";

/**
 * Fetch review with review id
 * @param reviewID id of review to get
 * @returns Review
 */
export async function fetchReview(reviewID: number): Promise<Review> {
    // get review
    const response = await fetch(`${API_URL}/reviews/review/${reviewID}`);
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    // format
    json.date_created = new Date(Date.parse(json.date_created));

    return json as Review;
}

/**
 * Fetch reviews
 * @param page page number, if excluded response will not be paginated
 * @param search search query, default ""
 * @param profileID id of profile to get reviews written by profile
 * @param drinkID id of drink to get reviews written about drink
 */
export async function fetchReviews({
    search = "",
    page,
    profileID,
    drinkID,
}: {
    page?: number;
    search?: string;
    profileID?: number;
    drinkID?: number;
}): Promise<{ reviews: Review[]; num_pages: number }> {
    // check queries
    let url = `${API_URL}/reviews/?search=${search}&`;

    if (page != undefined) url += `page=${page}&`;
    if (profileID != undefined) url += `profile=${profileID}&`;
    if (drinkID != undefined) url += `drink=${drinkID}`;

    // request
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    return json;
}

/**
 * Fetch recent reviews
 * @param pageParam page number
 * @returns reviews - Review array
 * @returns nextCursor - next page
 * @returns num_pages - total number of pages
 */
export async function fetchRecentReviews({ pageParam = 1 }): Promise<{
    reviews: Review[];
    nextCursor: number | undefined;
    num_pages: number;
}> {
    const response = await fetch(
        `${API_URL}/reviews/?page=${pageParam}&recent=true`
    );
    const json = await response.json();

    if (!response.ok) {
        throw new Error((json as FetchError).detail);
    }

    const nextCursor = pageParam < json.num_pages ? pageParam + 1 : undefined;

    return {
        reviews: json.reviews,
        nextCursor: nextCursor,
        num_pages: json.num_pages,
    };
}

/**
 * Fetch images for review with review id
 * @param reviewID id of review
 * @returns array of DrinkImages
 */
export async function fetchReviewImages(
    reviewID: number
): Promise<DrinkImage[]> {
    // get review
    const response = await fetch(
        `${API_URL}/reviews/images/?review=${reviewID}`
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    return (json as { images: DrinkImage[] }).images;
}

/**
 * Fetch likes for review with review id
 * @param reviewID id of review
 * @returns array of ReviewLikes
 */
export async function fetchReviewLikes(
    reviewID: number
): Promise<ReviewLike[]> {
    // get review
    const response = await fetch(
        `${API_URL}/reviews/review-likes/?review=${reviewID}`
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    return (json as { likes: ReviewLike[] }).likes;
}

/**
 * Fetch comments for review with review id
 * @param reviewID id of review
 * @returns array of Comments
 */
export async function fetchReviewComments(
    reviewID: number
): Promise<ReviewComment[]> {
    // get review
    const response = await fetch(
        `${API_URL}/reviews/comments/?review=${reviewID}`
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    return (json as { comments: ReviewComment[] }).comments;
}

/**
 * Fetch comment
 * @param commentID id of comment
 * @returns Comment
 */
export async function fetchComment(commentID: number): Promise<ReviewComment> {
    const response = await fetch(`${API_URL}/reviews/comment/${commentID}`);
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    // format
    json.date_created = new Date(Date.parse(json.date_created));

    return json as ReviewComment;
}

/**
 * Fetch likes for comment with comment id
 * @param commentID id of comment
 * @returns array of CommentLikes
 */
export async function fetchCommentLikes(
    commentID: number
): Promise<CommentLike[]> {
    // get likes
    const response = await fetch(
        `${API_URL}/reviews/comment-likes/?comment=${commentID}`
    );
    const json = await response.json();

    if (!response.ok) {
        let message = "Server Error";
        if (response.status != 500) message = (json as FetchError).detail;

        throw new Error(message);
    }

    return (json as { likes: CommentLike[] }).likes;
}

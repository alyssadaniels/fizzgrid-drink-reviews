import { http, HttpResponse } from "msw";
import {
    commentLikes,
    drinkFavorites,
    drinkImages,
    drinks,
    follows,
    profiles,
    reviewComments,
    reviewLikes,
    reviews,
} from "./data";
import { API_URL } from "../../src/util/constants";

// right now assumes perfectly formed data
// also ignores query params for some
export const handlers = [
    // all profiles
    http.get(`${API_URL}/profiles/`, () => {
        return HttpResponse.json({ profiles: profiles, num_pages: 1 });
    }),

    // user profile
    http.get(`${API_URL}/profiles/profile`, () => {
        return HttpResponse.json(profiles[0]);
    }),

    // one profile
    http.get(`${API_URL}/profiles/profile/:id`, ({ params }) => {
        const profileID: number = +params.id;
        return HttpResponse.json(profiles[profileID]);
    }),

    // followers/following
    http.get(`${API_URL}/profiles/follows/`, ({ request }) => {
        // get query params
        const url = new URL(request.url);
        const followerID = url.searchParams.get("follower");
        const followingID = url.searchParams.get("following");

        if (followerID) {
            const id = +followerID;
            const filteredFollows = follows.filter(
                (follow) => follow.follower_id === id
            );

            return HttpResponse.json({ follows: filteredFollows });
        }

        if (followingID) {
            const id = +followingID;
            const filteredFollows = follows.filter(
                (follow) => follow.following_id === id
            );

            return HttpResponse.json({ follows: filteredFollows });
        }

        return HttpResponse.json({ follows: follows });
    }),

    // all drinks
    http.get(`${API_URL}/drinks/`, () => {
        return HttpResponse.json({ drinks: drinks, num_pages: 1 });
    }),

    // one drink
    http.get(`${API_URL}/drinks/drink/:id`, ({ params }) => {
        const drinkID: number = +params.id;
        return HttpResponse.json(drinks[drinkID]);
    }),

    // drink favorites
    http.get(`${API_URL}/drinks/favorites/`, ({ request }) => {
        // get query params
        const url = new URL(request.url);
        const drinkID = url.searchParams.get("drink");
        const profileID = url.searchParams.get("profile");

        if (drinkID) {
            const id = +drinkID;
            const filteredFavorites = drinkFavorites.filter(
                (favorite) => favorite.drink_id === id
            );

            return HttpResponse.json({ favorites: filteredFavorites });
        }

        if (profileID) {
            const id = +profileID;
            const filteredFavorites = drinkFavorites.filter(
                (favorite) => favorite.profile_id === id
            );

            return HttpResponse.json({ favorites: filteredFavorites });
        }

        return HttpResponse.json({ favorites: drinkFavorites });
    }),

    // drink images
    http.get(`${API_URL}/drinks/images/`, ({ request }) => {
        // get query params
        const url = new URL(request.url);
        const drinkID = url.searchParams.get("drink");

        if (drinkID) {
            const id = +drinkID;
            const filteredImages = drinkImages.filter(
                (image) => image.drink_id === id
            );

            return HttpResponse.json({ images: filteredImages });
        }

        return HttpResponse.json({ images: drinkImages });
    }),

    // reviews
    http.get(`${API_URL}/reviews/`, ({ request }) => {
        // get query params
        const url = new URL(request.url);
        const drinkID = url.searchParams.get("drink");
        const profileID = url.searchParams.get("profile");

        if (drinkID) {
            const id = +drinkID;
            const filteredReviews = reviews.filter(
                (review) => review.drink_id === id
            );

            return HttpResponse.json({
                reviews: filteredReviews,
                num_pages: 1,
            });
        }

        if (profileID) {
            const id = +profileID;
            const filteredReviews = reviews.filter(
                (review) => review.profile_id === id
            );

            return HttpResponse.json({
                reviews: filteredReviews,
                num_pages: 1,
            });
        }

        return HttpResponse.json({ reviews: reviews, num_pages: 1 });
    }),

    // one review
    http.get(`${API_URL}/reviews/review/:id`, ({ params }) => {
        const reviewID = +params.id;

        return HttpResponse.json(reviews[reviewID]);
    }),

    // review images
    http.get(`${API_URL}/reviews/images/`, ({ request }) => {
        // get query params
        const url = new URL(request.url);
        const reviewID = url.searchParams.get("review");

        if (reviewID) {
            const id = +reviewID;
            const review = reviews[id];
            const filteredImages = drinkImages.filter(
                (image) => image.drink_id === review.drink_id
            );

            return HttpResponse.json({ images: filteredImages });
        }

        return HttpResponse.json({ images: drinkImages });
    }),

    // review likes
    http.get(`${API_URL}/reviews/review-likes/`, ({ request }) => {
        // query params
        const url = new URL(request.url);
        const reviewID = url.searchParams.get("review");

        if (reviewID) {
            const id = +reviewID;
            const filteredLikes = reviewLikes.filter(
                (like) => like.review_id === id
            );

            return HttpResponse.json({ likes: filteredLikes });
        }

        return HttpResponse.json({ likes: reviewLikes });
    }),

    // comments
    http.get(`${API_URL}/reviews/comments/`, ({ request }) => {
        // query params
        const url = new URL(request.url);
        const reviewID = url.searchParams.get("review");

        if (reviewID) {
            const id = +reviewID;
            const filteredComments = reviewComments.filter(
                (comment) => comment.review_id === id
            );

            return HttpResponse.json({ comments: filteredComments });
        }

        return HttpResponse.json({ comments: reviewComments });
    }),

    // one comment
    http.get(`${API_URL}/reviews/comment/:id`, ({ params }) => {
        const commentID = +params.id;

        return HttpResponse.json(reviewComments[commentID]);
    }),

    // comment likes
    http.get(`${API_URL}/reviews/comment-likes/`, ({ request }) => {
        const url = new URL(request.url);
        const commentID = url.searchParams.get("comment");

        if (commentID) {
            const id = +commentID;
            const filteredLikes = commentLikes.filter(
                (like) => like.comment_id === id
            );

            return HttpResponse.json({ likes: filteredLikes });
        }

        return HttpResponse.json({ likes: commentLikes });
    }),
];

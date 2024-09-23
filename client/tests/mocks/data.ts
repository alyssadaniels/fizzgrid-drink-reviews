import {
    CommentLike,
    Drink,
    DrinkFavorite,
    DrinkImage,
    Follow,
    Review,
    ReviewComment,
    ReviewLike,
} from "../../src/util/types";

/**
 * mock data
 * indices of arrays represent the id of that obj, ex. comments[0] is comment with id 0
 */

interface ProfileResponseData {
    profile: { id: number; profile_img: string };
    user: { username: string; email?: string };
}

export const profiles: ProfileResponseData[] = [
    {
        profile: { id: 0, profile_img: "/user-0-profile-img.png" },
        user: { username: "user0" },
    },
    {
        profile: { id: 1, profile_img: "/user-1-profile-img.png" },
        user: { username: "user1" },
    },
    {
        profile: { id: 2, profile_img: "/user-2-profile-img.png" },
        user: { username: "user2" },
    },
    {
        profile: { id: 3, profile_img: "/user-3-profile-img.png" },
        user: { username: "user3" },
    },
    {
        profile: { id: 4, profile_img: "/user-4-profile-img.png" },
        user: { username: "user4" },
    },
];
export const follows: Follow[] = [
    { id: 0, following_id: 1, follower_id: 4, date_created: new Date() },
    { id: 1, following_id: 1, follower_id: 2, date_created: new Date() },
    { id: 2, following_id: 2, follower_id: 3, date_created: new Date() },
    { id: 3, following_id: 3, follower_id: 0, date_created: new Date() },
    { id: 4, following_id: 0, follower_id: 1, date_created: new Date() },
    { id: 5, following_id: 0, follower_id: 2, date_created: new Date() },
    { id: 6, following_id: 2, follower_id: 4, date_created: new Date() },
];

export const drinks: Drink[] = [
    { id: 0, product_name: "Product Name 0", brand_name: "Brand Name 0" },
    { id: 1, product_name: "Product Name 1", brand_name: "Brand Name 1" },
    { id: 2, product_name: "Product Name 2", brand_name: "Brand Name 2" },
    { id: 3, product_name: "Product Name 3", brand_name: "Brand Name 3" },
    { id: 4, product_name: "Product Name 4", brand_name: "Brand Name 4" },
];
export const drinkFavorites: DrinkFavorite[] = [
    { id: 0, profile_id: 0, drink_id: 0, date_created: new Date() },
    { id: 1, profile_id: 0, drink_id: 1, date_created: new Date() },
    { id: 2, profile_id: 1, drink_id: 2, date_created: new Date() },
    { id: 3, profile_id: 1, drink_id: 3, date_created: new Date() },
    { id: 4, profile_id: 2, drink_id: 4, date_created: new Date() },
    { id: 5, profile_id: 2, drink_id: 0, date_created: new Date() },
    { id: 6, profile_id: 3, drink_id: 1, date_created: new Date() },
    { id: 7, profile_id: 3, drink_id: 2, date_created: new Date() },
    { id: 8, profile_id: 4, drink_id: 3, date_created: new Date() },
    { id: 8, profile_id: 4, drink_id: 4, date_created: new Date() },
];
export const drinkImages: DrinkImage[] = [
    { id: 0, label: "Drink Image 0", image: "/drink-image-0", drink_id: 0 },
    { id: 1, label: "Drink Image 1", image: "/drink-image-1", drink_id: 0 },
    { id: 2, label: "Drink Image 2", image: "/drink-image-2", drink_id: 1 },
    { id: 3, label: "Drink Image 3", image: "/drink-image-3", drink_id: 2 },
];

export const reviews: Review[] = [
    {
        id: 0,
        date_created: new Date(),
        rating: 3,
        review_text: "Review text 0",
        profile_id: 0,
        drink_id: 0,
    },
    {
        id: 1,
        date_created: new Date(),
        rating: 5,
        review_text: "Review text 1",
        profile_id: 1,
        drink_id: 0,
    },
    {
        id: 2,
        date_created: new Date(),
        rating: 2,
        review_text: "Review text 2",
        profile_id: 2,
        drink_id: 1,
    },
    {
        id: 3,
        date_created: new Date(),
        rating: 1,
        review_text: "Review text 3",
        profile_id: 0,
        drink_id: 3,
    },
];
export const reviewLikes: ReviewLike[] = [
    { id: 0, review_id: 0, profile_id: 0 },
    { id: 1, review_id: 1, profile_id: 0 },
    { id: 2, review_id: 2, profile_id: 1 },
    { id: 3, review_id: 3, profile_id: 1 },
    { id: 4, review_id: 0, profile_id: 2 },
    { id: 5, review_id: 1, profile_id: 3 },
    { id: 6, review_id: 2, profile_id: 4 },
];
export const reviewComments: ReviewComment[] = [
    {
        id: 0,
        date_created: new Date(),
        comment_text: "Comment Text 0",
        review_id: 0,
        profile_id: 0,
    },
    {
        id: 1,
        date_created: new Date(),
        comment_text: "Comment Text 1",
        review_id: 0,
        profile_id: 1,
    },
    {
        id: 2,
        date_created: new Date(),
        comment_text: "Comment Text 2",
        review_id: 1,
        profile_id: 1,
    },
    {
        id: 3,
        date_created: new Date(),
        comment_text: "Comment Text 3",
        review_id: 2,
        profile_id: 3,
    },
];
export const commentLikes: CommentLike[] = [
    { id: 0, comment_id: 0, profile_id: 0 },
    { id: 1, comment_id: 0, profile_id: 2 },
    { id: 2, comment_id: 1, profile_id: 3 },
    { id: 3, comment_id: 2, profile_id: 4 },
];

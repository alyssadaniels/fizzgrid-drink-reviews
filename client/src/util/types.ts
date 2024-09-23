import { ReactNode } from "react";

// from api
export interface FetchError {
    detail: string;
}

export interface Profile {
    id: number;
    profile_img: string;
    username: string;
    email?: string;
}

export interface Follow {
    id: number;
    following_id: number;
    follower_id: number;
    date_created: Date;
}

export interface Drink {
    id: number;
    product_name: string;
    brand_name: string;
}

export interface DrinkFavorite {
    id: number;
    profile_id: number;
    drink_id: number;
    date_created: Date;
}

export interface DrinkImage {
    id: number;
    label: string;
    image: string;
    drink_id: number;
}

export interface Review {
    id: number;
    date_created: Date;
    rating: number;
    review_text: string;
    profile_id: number;
    drink_id: number;
}

export interface ReviewLike {
    id: number;
    review_id: number;
    profile_id: number;
}

export interface ReviewComment {
    id: number;
    date_created: Date;
    comment_text: string;
    review_id: number;
    profile_id: number;
}

export interface CommentLike {
    id: number;
    comment_id: number;
    profile_id: number;
}

export interface DrinkData {
    drink: Drink;
    images: DrinkImage[];
    reviews: { reviews: Review[]; num_pages: number };
    favorites: DrinkFavorite[];
}

// Note - image is DrinkImage (not ReviewImage) because image url is stored in a DrinkImage
export interface ReviewData {
    review: Review;
    images: DrinkImage[];
    profile: Profile;
    drink: Drink;
    likes: ReviewLike[];
}

export interface ProfileData {
    profile: Profile;
    followers: Follow[];
    following: Follow[];
    favorites: DrinkFavorite[];
    reviews: { reviews: Review[]; num_pages: number };
}

export interface CommentData {
    comment: ReviewComment;
    likes: CommentLike[];
    profile: Profile;
}

export interface ChildrenProps {
    children?: ReactNode;
}

export enum FetchContentOptions {
    JSON = "json",
    FormData = "formData",
}

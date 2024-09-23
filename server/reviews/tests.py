import json
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from django.utils import timezone
from profiles.models import Profile
from drinks.models import Drink
from .models import CommentLike, Review, ReviewLike, Comment
import random
from django.contrib.auth import get_user as auth_get_user


def format_date(date: timezone) -> str:
    return date.isoformat().split("+")[0] + "Z"


class TestReviewListGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profiles
        profile_objs = []
        for i in range(5):
            user = User.objects.create(username=f"user{i}")
            profile = Profile.objects.create(user=user)

            profile_objs.append(profile)

        for i in range(5):
            user = User.objects.create(username=f"specialuser{i}")
            profile = Profile.objects.create(user=user)

            profile_objs.append(profile)

        # drinks
        drink_objs = []
        for i in range(5):
            drink = Drink.objects.create(
                product_name=f"product {i}", brand_name=f"brand"
            )

            drink_objs.append(drink)

        for i in range(5):
            drink = Drink.objects.create(
                product_name=f"special product {i}", brand_name=f"brand"
            )

            drink_objs.append(drink)

        # reviews
        # each profile reviews each drink
        self.expected_review_data = []
        self.expected_recent_data = []
        self.expected_search_data = []

        for i in range(len(profile_objs)):
            for j in range(len(drink_objs)):
                profile_id = profile_objs[i].pk
                drink_id = drink_objs[j].pk
                review_text = f"Review for {drink_objs[j].product_name} by {profile_objs[i].user.username}"

                # place each review one day before the last so expected list is sorted most recent first
                days_ago = (j + 1) + (i * len(drink_objs))
                date_created = timezone.now() - timezone.timedelta(days=days_ago)

                rating = random.randint(1, 5)

                review = Review.objects.create(
                    profile_id=profile_id,
                    drink_id=drink_id,
                    review_text=review_text,
                    date_created=date_created,
                    rating=rating,
                )

                expected_review = {
                    "id": review.pk,
                    "profile_id": profile_id,
                    "drink_id": drink_id,
                    "review_text": review_text,
                    "date_created": format_date(date_created),
                    "rating": rating,
                }

                if days_ago < 7:
                    self.expected_recent_data.append(expected_review)

                if (
                    "special" in profile_objs[i].user.username
                    or "special" in drink_objs[j].product_name
                    or "special" in drink_objs[j].brand_name
                ):
                    self.expected_search_data.append(expected_review)

                self.expected_review_data.append(expected_review)

        # test data
        self.profile_id = profile_objs[0].pk
        self.drink_id = drink_objs[0].pk
        self.search_query = "special"
        self.page = 2

        # urls
        self.profile_url = f"/reviews/?profile={self.profile_id}"
        self.drink_url = f"/reviews/?drink={self.drink_id}"
        self.search_url = f"/reviews/?search={self.search_query}"
        self.page_url = f"/reviews/?page={self.page}"
        self.recent_url = "/reviews/?recent=true"
        self.all_url = "/reviews/"

    def test_get_profile(self):
        response = self.client.get(self.profile_url)
        response_json = json.loads(response.content)
        review_list = response_json["reviews"]

        expected = [
            review
            for review in self.expected_review_data
            if review["profile_id"] == self.profile_id
        ]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(expected, review_list)

    def test_get_drink(self):
        response = self.client.get(self.drink_url)
        response_json = json.loads(response.content)
        review_list = response_json["reviews"]

        expected = [
            review
            for review in self.expected_review_data
            if review["drink_id"] == self.drink_id
        ]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(expected, review_list)

    def test_get_search(self):
        response = self.client.get(self.search_url)
        response_json = json.loads(response.content)
        review_list = response_json["reviews"]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(self.expected_search_data, review_list)

    def test_get_page(self):
        response = self.client.get(self.page_url)
        response_json = json.loads(response.content)
        review_list = response_json["reviews"]
        num_pages = response_json["num_pages"]

        self.assertEqual(200, response.status_code)
        self.assertEqual(16, num_pages)
        self.assertListEqual(self.expected_review_data[6:12], review_list)

    def test_get_recent(self):
        response = self.client.get(self.recent_url)
        response_json = json.loads(response.content)
        review_list = response_json["reviews"]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(self.expected_recent_data, review_list)

    def test_get_all(self):
        response = self.client.get(self.all_url)
        response_json = json.loads(response.content)
        review_list = response_json["reviews"]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(self.expected_review_data, review_list)


class TestImageListGET(APITestCase):
    def test_get_review(self):
        pass

    def test_get_all(self):
        pass


class TestReviewLikeListGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profiles
        profile_objs = []
        for i in range(5):
            user = User.objects.create(username=f"user{i}")
            profile = Profile.objects.create(user=user)

            profile_objs.append(profile)

        # drinks
        drink_objs = []
        for i in range(5):
            drink = Drink.objects.create(
                product_name=f"product {i}", brand_name=f"brand"
            )

            drink_objs.append(drink)

        # reviews
        review_objs = []
        for i in range(len(profile_objs)):
            for j in range(len(drink_objs)):
                profile_id = profile_objs[i].pk
                drink_id = drink_objs[j].pk
                review_text = f"Review for {drink_objs[j].product_name} by {profile_objs[i].user.username}"

                # place each review one day before the last so expected list is sorted most recent first
                days_ago = (j + 1) + (i * len(drink_objs))
                date_created = timezone.now() - timezone.timedelta(days=days_ago)

                rating = random.randint(1, 5)

                review_objs.append(
                    Review.objects.create(
                        profile_id=profile_id,
                        drink_id=drink_id,
                        review_text=review_text,
                        date_created=date_created,
                        rating=rating,
                    )
                )

        # likes
        self.expected_like_data = []

        # first profile will like a handful of reviews
        for i in range(1, int(len(review_objs) / 2)):
            profile_id = profile_objs[0].pk
            review_id = review_objs[i].pk

            like = ReviewLike.objects.create(profile_id=profile_id, review_id=review_id)

            self.expected_like_data.append(
                {"id": like.pk, "profile_id": profile_id, "review_id": review_id}
            )

        # first review will be liked by handful of profiles
        for i in range(1, int(len(profile_objs) / 2)):
            profile_id = profile_objs[i].pk
            review_id = review_objs[0].pk

            like = ReviewLike.objects.create(profile_id=profile_id, review_id=review_id)

            self.expected_like_data.append(
                {"id": like.pk, "profile_id": profile_id, "review_id": review_id}
            )

        # test data
        self.profile_id = profile_objs[0].pk
        self.review_id = review_objs[0].pk

        # urls
        self.all_url = "/reviews/review-likes/"
        self.profile_url = f"/reviews/review-likes/?profile={self.profile_id}"
        self.review_url = f"/reviews/review-likes/?review={self.review_id}"

    def test_get_review(self):
        response = self.client.get(self.review_url)
        response_json = json.loads(response.content)
        like_list = response_json["likes"]

        expected = [
            like
            for like in self.expected_like_data
            if like["review_id"] == self.review_id
        ]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(expected, like_list)

    def test_get_profile(self):
        response = self.client.get(self.profile_url)
        response_json = json.loads(response.content)
        like_list = response_json["likes"]

        expected = [
            like
            for like in self.expected_like_data
            if like["profile_id"] == self.profile_id
        ]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(expected, like_list)

    def test_get_all(self):
        response = self.client.get(self.all_url)
        response_json = json.loads(response.content)
        like_list = response_json["likes"]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(self.expected_like_data, like_list)


class TestCommentListGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profiles
        profile_objs = []
        for i in range(5):
            user = User.objects.create(username=f"user{i}")
            profile = Profile.objects.create(user=user)

            profile_objs.append(profile)

        # drinks
        drink_objs = []
        for i in range(5):
            drink = Drink.objects.create(
                product_name=f"product {i}", brand_name=f"brand"
            )

            drink_objs.append(drink)

        # reviews
        review_objs = []
        for i in range(2):
            review_text = f"Review for {drink_objs[0].product_name} by {profile_objs[0].user.username}"
            review = Review.objects.create(
                profile_id=profile_objs[0].pk,
                drink_id=drink_objs[0].pk,
                review_text=review_text,
                date_created=timezone.now(),
                rating=2,
            )

            review_objs.append(review)

        # create comments
        self.expected_comments = []
        self.expected_review_comments = []

        for i in range(len(profile_objs)):
            review = random.randint(0, 1)

            review_id = review_objs[review].pk
            profile_id = profile_objs[i].pk
            comment_text = f"{profile_objs[i].user.username}'s comment on review for {review_objs[review].drink.product_name}"

            # place each comment one day before the last so expected list is sorted most recent first
            date_created = timezone.now() - timezone.timedelta(days=i)

            comment = Comment.objects.create(
                review_id=review_id,
                profile_id=profile_id,
                comment_text=comment_text,
                date_created=date_created,
            )

            comment_data = {
                "id": comment.pk,
                "review_id": review_id,
                "profile_id": profile_id,
                "comment_text": comment_text,
                "date_created": format_date(date_created),
            }

            if review == 0:
                self.expected_review_comments.append(comment_data)

            self.expected_comments.append(comment_data)

        # urls
        self.review_url = f"/reviews/comments/?review={review_objs[0].pk}"
        self.all_url = "/reviews/comments/"

    def test_get_review(self):
        response = self.client.get(self.review_url)
        response_json = json.loads(response.content)
        comment_list = response_json["comments"]

        self.assertEqual(200, response.status_code)
        self.assertEqual(self.expected_review_comments, comment_list)

    def test_get_all(self):
        response = self.client.get(self.all_url)
        response_json = json.loads(response.content)
        comment_list = response_json["comments"]

        self.assertEqual(200, response.status_code)
        self.assertEqual(self.expected_comments, comment_list)


class TestCommentLikeListGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profiles
        profile_objs = []
        for i in range(5):
            user = User.objects.create(username=f"user{i}")
            profile = Profile.objects.create(user=user)

            profile_objs.append(profile)

        # drink
        drink = Drink.objects.create(product_name=f"product {i}", brand_name=f"brand")

        # review
        review_text = (
            f"Review for {drink.product_name} by {profile_objs[0].user.username}"
        )
        review = Review.objects.create(
            profile_id=profile_objs[0].pk,
            drink_id=drink.pk,
            review_text=review_text,
            date_created=timezone.now(),
            rating=2,
        )

        # comments, each profile leaving 3 comments on the review
        comment_objs = []
        for i in range(len(profile_objs)):
            for j in range(3):
                review_id = review.pk
                profile_id = profile_objs[i].pk
                comment_text = f"{profile_objs[i].user.username}'s comment {j} on review for {review.drink.product_name}"

                date_created = timezone.now() - timezone.timedelta(days=i)

                comment_objs.append(
                    Comment.objects.create(
                        review_id=review_id,
                        profile_id=profile_id,
                        comment_text=comment_text,
                        date_created=date_created,
                    )
                )

        # likes
        self.expected_like_data = []
        self.expected_profile_likes = []
        self.expected_comment_likes = []

        # first profile will like handful of comments
        for i in range(1, int(len(comment_objs) / 2)):
            profile_id = profile_objs[0].pk
            comment_id = comment_objs[i].pk

            like = CommentLike.objects.create(
                profile_id=profile_id, comment_id=comment_id
            )

            expected_data = {
                "id": like.pk,
                "profile_id": profile_id,
                "comment_id": comment_id,
            }

            self.expected_like_data.append(expected_data)
            self.expected_profile_likes.append(expected_data)

        # first comment will be liked by handful of profiles
        for i in range(1, int(len(profile_objs) / 2)):
            profile_id = profile_objs[i].pk
            comment_id = comment_objs[0].pk

            like = CommentLike.objects.create(
                profile_id=profile_id, comment_id=comment_id
            )

            expected_data = {
                "id": like.pk,
                "profile_id": profile_id,
                "comment_id": comment_id,
            }

            self.expected_like_data.append(expected_data)
            self.expected_comment_likes.append(expected_data)

        # urls
        self.all_url = "/reviews/comment-likes/"
        self.comment_url = f"/reviews/comment-likes/?comment={comment_objs[0].pk}"
        self.profile_url = f"/reviews/comment-likes/?profile={profile_objs[0].pk}"

    def test_get_comment(self):
        response = self.client.get(self.comment_url)
        response_json = json.loads(response.content)
        like_list = response_json["likes"]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(self.expected_comment_likes, like_list)

    def test_get_profile(self):
        response = self.client.get(self.profile_url)
        response_json = json.loads(response.content)
        like_list = response_json["likes"]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(self.expected_profile_likes, like_list)

    def test_get_all(self):
        response = self.client.get(self.all_url)
        response_json = json.loads(response.content)
        like_list = response_json["likes"]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(self.expected_like_data, like_list)


class TestReviewDetailGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        user = User.objects.create(username="user")
        profile = Profile.objects.create(user=user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        profile_id = profile.pk
        drink_id = drink.pk
        review_text = "Review text"
        date_created = timezone.now()
        rating = 4

        review = Review.objects.create(
            profile_id=profile_id,
            drink_id=drink_id,
            review_text=review_text,
            date_created=date_created,
            rating=rating,
        )

        self.expected_data = {
            "id": review.pk,
            "profile_id": profile_id,
            "drink_id": drink_id,
            "review_text": review_text,
            "date_created": format_date(date_created),
            "rating": rating,
        }

        # urls
        self.good_url = f"/reviews/review/{review.pk}/"
        self.not_found_url = f"/reviews/review/{review.pk + 1}/"

    def test_reject_review_not_found(self):
        response = self.client.get(self.not_found_url)

        self.assertEqual(404, response.status_code)

    def test_get_review(self):
        response = self.client.get(self.good_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertDictEqual(self.expected_data, response_json)


class TestReviewDetailPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        self.username = "user"
        self.password = "userpass123"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()
        self.profile = Profile.objects.create(user=user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review data
        self.review_data = {
            "drink_id": drink.pk,
            "review_text": f"Review for {drink.product_name}",
            "rating": 3,
        }

        # url
        self.url = "/reviews/review/"

    def test_reject_no_user(self):
        response = self.client.post(self.url, self.review_data, format="multipart")

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

    def test_reject_no_rating(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        body = {
            "drink_id": self.review_data["drink_id"],
            "review_text": self.review_data["review_text"],
        }

        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

    def test_reject_out_of_range_rating(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # to low
        body = {
            "drink_id": self.review_data["drink_id"],
            "review_text": self.review_data["review_text"],
            "rating": 0,
        }

        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

        # to high
        body = {
            "drink_id": self.review_data["drink_id"],
            "review_text": self.review_data["review_text"],
            "rating": 6,
        }

        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

    def test_reject_no_text(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # no text
        body = {
            "drink_id": self.review_data["drink_id"],
            "rating": self.review_data["rating"],
        }

        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

    def test_reject_out_of_range_text(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # to short
        body = {
            "drink_id": self.review_data["drink_id"],
            "rating": self.review_data["rating"],
            "review_text": "",
        }

        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

        # to long
        body = {
            "drink_id": self.review_data["drink_id"],
            "rating": self.review_data["rating"],
            "review_text": "x" * 4097,
        }

        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

    def test_reject_no_drink(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        body = {
            "rating": self.review_data["rating"],
            "review_text": self.review_data["review_text"],
        }

        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

    def test_reject_not_found_drink(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        body = {
            "drink_id": self.review_data["drink_id"] + 1,
            "rating": self.review_data["rating"],
            "review_text": self.review_data["review_text"],
        }

        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(404, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))

    def test_reject_non_image(self):
        pass

    def test_post_review(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.url, self.review_data, format="multipart")
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertTrue(
            Review.objects.filter(
                drink_id=self.review_data["drink_id"],
                profile_id=self.profile.pk,
                review_text=self.review_data["review_text"],
                rating=self.review_data["rating"],
            )
        )

        review = Review.objects.get(
            drink_id=self.review_data["drink_id"], profile_id=self.profile.pk
        )
        expected_data = {
            "id": review.pk,
            "profile_id": review.profile.pk,
            "drink_id": review.drink.pk,
            "review_text": review.review_text,
            "rating": review.rating,
            "date_created": format_date(review.date_created),
        }

        self.assertDictEqual(expected_data, response_json)


class TestReviewDetailDELETE(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        self.username = "user"
        self.password = "userpass123"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()
        profile = Profile.objects.create(user=user)

        # other profile
        self.other_username = "user2"
        self.other_password = "user2pass123"
        other_user = User(username=self.other_username)
        other_user.set_password(self.other_password)
        other_user.save()
        other_profile = Profile.objects.create(user=other_user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        review = Review.objects.create(
            profile=profile,
            drink=drink,
            review_text="Review text",
            date_created=timezone.now(),
            rating=4,
        )

        self.review_data = {
            "id": review.pk,
            "profile_id": review.profile.pk,
            "drink_id": review.drink.pk,
            "review_text": review.review_text,
            "rating": review.rating,
            "date_created": format_date(review.date_created),
        }

        # url
        self.url = f"/reviews/review/{review.pk}/"
        self.not_found_url = f"/reviews/review/{review.pk + 1}/"

    def test_reject_no_user(self):
        response = self.client.delete(self.url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(Review.objects.all()))

    def test_reject_wrong_user(self):
        # login
        self.client.login(username=self.other_username, password=self.other_password)

        # request
        response = self.client.delete(self.url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(Review.objects.all()))

    def test_reject_not_found_review(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.not_found_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(Review.objects.all()))

    def test_delete_review(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(Review.objects.all()))
        self.assertDictEqual(self.review_data, response_json)


class TestCommentDetailGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        user = User.objects.create(username="user")
        profile = Profile.objects.create(user=user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        review = Review.objects.create(
            profile_id=profile.pk,
            drink_id=drink.pk,
            review_text="Review text",
            date_created=timezone.now(),
            rating=4,
        )

        # comment
        profile_id = profile.pk
        review_id = review.pk
        comment_text = "Comment text"
        date_created = timezone.now()

        comment = Comment.objects.create(
            profile_id=profile_id,
            review_id=review_id,
            comment_text=comment_text,
            date_created=date_created,
        )

        self.expected_data = {
            "id": comment.pk,
            "profile_id": profile_id,
            "review_id": review_id,
            "comment_text": comment_text,
            "date_created": format_date(date_created),
        }

        # urls
        self.good_url = f"/reviews/comment/{comment.pk}/"
        self.not_found_url = f"/reviews/comment/{comment.pk + 1}/"

    def test_reject_comment_not_found(self):
        response = self.client.get(self.not_found_url)

        self.assertEqual(404, response.status_code)

    def test_get_comment(self):
        response = self.client.get(self.good_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertDictEqual(self.expected_data, response_json)


class TestCommentDetailPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        self.username = "user"
        self.password = "userpass123"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()
        self.profile = Profile.objects.create(user=user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        review = Review.objects.create(
            profile_id=self.profile.pk,
            drink_id=drink.pk,
            review_text="Review text",
            date_created=timezone.now(),
            rating=4,
        )

        # data
        self.comment_data = {
            "review_id": review.pk,
            "drink_id": drink.pk,
            "comment_text": "Comment text",
        }

        # urls
        self.url = "/reviews/comment/"

    def test_reject_no_user(self):
        response = self.client.post(self.url, self.comment_data, format="multipart")

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, len(Comment.objects.all()))

    def test_no_review(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # body
        body = {
            "drink_id": self.comment_data["drink_id"],
            "comment_text": self.comment_data["comment_text"],
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Comment.objects.all()))

    def test_not_found_review(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # body
        body = {
            "review_id": self.comment_data["review_id"] + 1,
            "comment_text": self.comment_data["comment_text"],
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(404, response.status_code)
        self.assertEqual(0, len(Comment.objects.all()))

    def test_no_text(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # body
        body = {
            "review_id": self.comment_data["review_id"],
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Comment.objects.all()))

    def test_out_of_range_text(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # to short
        body = {
            "review_id": self.comment_data["review_id"],
            "comment_text": "",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Comment.objects.all()))

        # to long
        body = {
            "review_id": self.comment_data["review_id"],
            "comment_text": "x" * 281,
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Comment.objects.all()))

    def test_reject_duplicate(self):
        # create comment
        Comment.objects.create(
            profile=self.profile,
            comment_text=self.comment_data["comment_text"],
            date_created=timezone.now(),
            review_id=self.comment_data["review_id"],
        )

        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.url, self.comment_data, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(Comment.objects.all()))

    def test_create_comment(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.url, self.comment_data, format="multipart")
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertTrue(
            Comment.objects.filter(
                profile=self.profile,
                comment_text=self.comment_data["comment_text"],
                review_id=self.comment_data["review_id"],
            )
        )

        comment = Comment.objects.get(
            profile=self.profile,
            comment_text=self.comment_data["comment_text"],
            review_id=self.comment_data["review_id"],
        )
        expected_data = {
            "id": comment.pk,
            "profile_id": comment.profile.pk,
            # TODO why does json.loads not convert review id to int
            "review_id": str(comment.review.pk),
            "comment_text": comment.comment_text,
            "date_created": format_date(comment.date_created),
        }

        self.assertDictEqual(expected_data, response_json)


class TestCommentDetailDELETE(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        self.username = "user"
        self.password = "userpass123"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()
        profile = Profile.objects.create(user=user)

        # other profile
        self.other_username = "user2"
        self.other_password = "user2pass123"
        other_user = User(username=self.other_username)
        other_user.set_password(self.other_password)
        other_user.save()
        other_profile = Profile.objects.create(user=other_user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        review = Review.objects.create(
            profile_id=profile.pk,
            drink_id=drink.pk,
            review_text="Review text",
            date_created=timezone.now(),
            rating=4,
        )

        # comment
        comment = Comment.objects.create(
            profile=profile,
            review=review,
            comment_text="Comment text",
            date_created=timezone.now(),
        )

        # data
        self.comment_data = {
            "id": comment.pk,
            "review_id": comment.review.pk,
            "profile_id": comment.profile.pk,
            "comment_text": comment.comment_text,
            "date_created": format_date(comment.date_created),
        }

        # urls
        self.url = f"/reviews/comment/{comment.pk}/"
        self.no_comment_url = f"/reviews/comment/{comment.pk + 1}/"

    def test_reject_no_user(self):
        response = self.client.delete(self.url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(Comment.objects.all()))

    def test_reject_wrong_user(self):
        # login
        self.client.login(username=self.other_username, password=self.other_password)

        # request
        response = self.client.delete(self.url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(Comment.objects.all()))

    def test_not_found_comment(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.no_comment_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(Comment.objects.all()))

    def test_delete_comment(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(Comment.objects.all()))
        self.assertDictEqual(self.comment_data, response_json)


class TestCommentLikeDetailPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        self.username = "user"
        self.password = "userpass123"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()
        self.profile = Profile.objects.create(user=user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        review = Review.objects.create(
            profile_id=self.profile.pk,
            drink_id=drink.pk,
            review_text="Review text",
            date_created=timezone.now(),
            rating=4,
        )

        # comment
        self.comment = Comment.objects.create(
            profile=self.profile,
            review=review,
            comment_text="Comment text",
            date_created=timezone.now(),
        )

        # urls
        self.url = f"/reviews/comment/{self.comment.pk}/like/"
        self.no_comment_url = f"/reviews/comment/{self.comment.pk + 1}/like/"

    def test_reject_no_user(self):
        response = self.client.post(self.url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, len(CommentLike.objects.all()))

    def test_reject_not_found_comment(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.no_comment_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(0, len(CommentLike.objects.all()))

    def test_reject_duplicate(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # create like
        CommentLike.objects.create(comment=self.comment, profile=self.profile)

        # request
        response = self.client.post(self.url)

        self.assertEqual(409, response.status_code)
        self.assertEqual(1, len(CommentLike.objects.all()))

    def test_create_like(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(
            1,
            len(CommentLike.objects.filter(comment=self.comment, profile=self.profile)),
        )

        like = CommentLike.objects.get(comment=self.comment, profile=self.profile)
        expected_data = {
            "id": like.pk,
            "comment_id": like.comment.pk,
            "profile_id": like.profile.pk,
        }

        self.assertDictEqual(expected_data, response_json)


class TestCommentLikeDetailDELETE(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        self.username = "user"
        self.password = "userpass123"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()
        profile = Profile.objects.create(user=user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        review = Review.objects.create(
            profile_id=profile.pk,
            drink_id=drink.pk,
            review_text="Review text",
            date_created=timezone.now(),
            rating=4,
        )

        # comment
        comment = Comment.objects.create(
            profile=profile,
            review=review,
            comment_text="Comment text",
            date_created=timezone.now(),
        )

        # other comment
        comment2 = Comment.objects.create(
            profile=profile,
            review=review,
            comment_text="Comment text 2",
            date_created=timezone.now(),
        )

        # like
        like = CommentLike.objects.create(comment=comment, profile=profile)

        # data
        self.like_data = {
            "id": like.pk,
            "comment_id": like.comment.pk,
            "profile_id": like.profile.pk,
        }

        # urls
        self.url = f"/reviews/comment/{comment.pk}/like/"
        self.no_comment_url = f"/reviews/comment/{comment.pk + comment2.pk}/like/"
        self.no_like_url = f"/reviews/comment/{comment2.pk}/like/"

    def test_reject_no_user(self):
        response = self.client.delete(self.url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(CommentLike.objects.all()))

    def test_reject_not_found_comment(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.no_comment_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(CommentLike.objects.all()))

    def test_reject_like_not_found(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.no_like_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(CommentLike.objects.all()))

    def test_delete_like(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(CommentLike.objects.all()))
        self.assertDictEqual(self.like_data, response_json)


class TestReviewLikeDetailPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        self.username = "user"
        self.password = "userpass123"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()
        self.profile = Profile.objects.create(user=user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        self.review = Review.objects.create(
            profile_id=self.profile.pk,
            drink_id=drink.pk,
            review_text="Review text",
            date_created=timezone.now(),
            rating=4,
        )

        # urls
        self.url = f"/reviews/review/{self.review.pk}/like/"
        self.no_review_url = f"/reviews/review/{self.review.pk + 1}/like/"

    def test_reject_no_user(self):
        response = self.client.post(self.url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, len(ReviewLike.objects.all()))

    def test_reject_not_found_review(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.no_review_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(0, len(ReviewLike.objects.all()))

    def test_reject_duplicate(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # create like
        ReviewLike.objects.create(profile=self.profile, review=self.review)

        # request
        response = self.client.post(self.url)

        self.assertEqual(409, response.status_code)
        self.assertEqual(1, len(ReviewLike.objects.all()))

    def test_create_like(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(
            1, len(ReviewLike.objects.filter(profile=self.profile, review=self.review))
        )

        like = ReviewLike.objects.get(profile=self.profile, review=self.review)
        self.assertDictEqual(
            {"id": like.pk, "profile_id": like.profile.pk, "review_id": like.review.pk},
            response_json,
        )


class TestReviewLikeDetailDELETE(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # profile
        self.username = "user"
        self.password = "userpass123"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()
        profile = Profile.objects.create(user=user)

        # drink
        drink = Drink.objects.create(product_name="Product", brand_name="Brand")

        # review
        review = Review.objects.create(
            profile_id=profile.pk,
            drink_id=drink.pk,
            review_text="Review text",
            date_created=timezone.now(),
            rating=4,
        )

        # other review
        review2 = Review.objects.create(
            profile_id=profile.pk,
            drink_id=drink.pk,
            review_text="Review text 2",
            date_created=timezone.now(),
            rating=3,
        )

        # like
        like = ReviewLike.objects.create(profile=profile, review=review)

        self.like_data = {
            "id": like.pk,
            "profile_id": like.profile.pk,
            "review_id": like.review.pk,
        }

        # urls
        self.url = f"/reviews/review/{review.pk}/like/"
        self.no_review_url = f"/review/review/{review.pk + review2.pk}/like/"
        self.no_like_url = f"/review/review/{review2.pk}/like/"

    def test_reject_no_user(self):
        response = self.client.delete(self.url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(ReviewLike.objects.all()))

    def test_reject_not_found_review(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.no_review_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(ReviewLike.objects.all()))

    def test_reject_like_not_found(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.no_like_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(ReviewLike.objects.all()))

    def test_delete_like(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(ReviewLike.objects.all()))
        self.assertEqual(self.like_data, response_json)

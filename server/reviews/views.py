from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from profiles.models import Profile
from drinks.serializers import DrinkImageSerializer
from .serializers import (
    CommentLikeSerializer,
    CommentSerializer,
    ReviewLikeSerializer,
    ReviewSerializer,
)
from .models import Review, ReviewImage, ReviewLike, Comment, CommentLike
from drinks.models import Drink, DrinkImage
import json
from django.core.paginator import Paginator
from django.db.models import F
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.parsers import MultiPartParser


class ReviewList(APIView):
    """
    List reviews
    """

    def get(self, request):
        """
        Get reviews
        Optional query params - profile: int, drink: int, search: string, page: int, recent: boolean
        """
        reviews = Review.objects.all()

        # check recent
        recent = request.query_params.get("recent")
        if recent:
            if recent.lower() == "true":
                now = timezone.now()
                week_ago = now - timezone.timedelta(days=7)

                reviews = reviews.filter(
                    date_created__gte=week_ago, date_created__lt=now
                )

        # check profile
        profile = request.query_params.get("profile")
        if profile:
            if Profile.objects.filter(pk=profile).exists():
                reviews = reviews.filter(profile_id=profile)
            else:
                return JsonResponse({"detail": "Profile not found"}, status=404)

        # check drink
        drink = request.query_params.get("drink")
        if drink:
            if Drink.objects.filter(pk=drink).exists():
                reviews = reviews.filter(drink_id=drink)
            else:
                return JsonResponse({"detail": "Drink not found"}, status=404)

        # check search
        search = request.query_params.get("search")
        if search:
            reviews = reviews.filter(review_text__icontains=search)

        # order by most recent first
        reviews = reviews.order_by("-date_created")

        # check page, only paginate if explicitly said so
        page = request.query_params.get("page")
        if page:
            try:
                page = int(page)
            except ValueError:
                return JsonResponse({"detail": "page must be an integer"})

            paginator = Paginator(reviews, 6, 4)
            page_obj = paginator.get_page(page)

            return JsonResponse(
                {
                    "reviews": ReviewSerializer(page_obj.object_list, many=True).data,
                    "num_pages": paginator.num_pages,
                }
            )

        # if not paginated, num_pages = 1
        return JsonResponse(
            {
                "reviews": ReviewSerializer(reviews, many=True).data,
                "num_pages": 1,
            }
        )


class ImageList(APIView):
    """
    List review images
    """

    def get(self, request):
        """
        Get review images
        Optional query param review: int
        """
        review_images = ReviewImage.objects.all()

        # check if review exists
        review_id = request.query_params.get("review")
        if review_id:
            if Review.objects.filter(pk=review_id).exists():
                review_images = review_images.filter(review_id=review_id)
            else:
                return JsonResponse({"detail": "Review not found"}, status=404)

        # get actual stored image
        drink_images = DrinkImage.objects.filter(
            pk__in=review_images.values("image_id")
        )

        return JsonResponse(
            {"images": DrinkImageSerializer(drink_images, many=True).data}
        )


class ReviewLikeList(APIView):
    """
    List review likes
    """

    def get(self, request):
        """
        Get review likes
        Optional query param - review: int, profile: int
        """
        likes = ReviewLike.objects.all()

        # check review
        review = request.query_params.get("review")

        if review:
            # check if review exists
            if Review.objects.filter(pk=review).exists():
                likes = likes.filter(review_id=review)
            else:
                return JsonResponse({"detail": "Review not found"}, status=404)

        # check profile
        profile = request.query_params.get("profile")

        if profile:
            # check if profile exists
            if Profile.objects.filter(pk=profile).exists():
                likes = likes.filter(profile_id=profile)
            else:
                return JsonResponse({"detail": "Profile not found"}, status=404)

        return JsonResponse({"likes": ReviewLikeSerializer(likes, many=True).data})


class CommentList(APIView):
    """
    List comments
    """

    def get(self, request):
        """
        Get comments
        Optional query param - review: int
        """
        comments = Comment.objects.all()

        # check review
        review = request.query_params.get("review")
        if review:
            if Review.objects.filter(pk=review).exists():
                comments = comments.filter(review_id=review)
            else:
                return JsonResponse({"detail": "Review not found"}, status=404)

        return JsonResponse({"comments": CommentSerializer(comments, many=True).data})


class CommentLikeList(APIView):
    """
    List comment likes
    """

    def get(self, request):
        """
        Get comment likes
        Optional query param - comment: int, profile: int
        """
        likes = CommentLike.objects.all()

        # check comment
        comment = request.query_params.get("comment")

        if comment:
            if Comment.objects.filter(pk=comment).exists():
                likes = likes.filter(comment_id=comment)
            else:
                return JsonResponse({"detail": "Comment not found"}, status=404)

        # check profile
        profile = request.query_params.get("profile")

        if profile:
            # check if profile exists
            if Profile.objects.filter(pk=profile).exists():
                likes = likes.filter(profile_id=profile)
            else:
                return JsonResponse({"detail": "Profile not found"}, status=404)

        return JsonResponse({"likes": CommentLikeSerializer(likes, many=True).data})


class ReviewDetail(APIView):
    """
    Detail review
    """

    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser]

    def get(self, request, review_id):
        """
        Get review with id review_id
        """
        review = None

        # check if review exists
        try:
            review = Review.objects.get(pk=review_id)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Review with id {review_id} not found"}, status=404
            )

        return JsonResponse(ReviewSerializer(review).data)

    def post(self, request):
        """
        Post new review
        Form data should include rating: int, review_text: string, drink_id: int, optional image: file
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        # get request data
        rating = request.data.get("rating")
        review_text = request.data.get("review_text")
        drink_id = request.data.get("drink_id")
        image = request.FILES.get("image")

        # check if data exists
        if not rating or int(rating) < 1 or int(rating) > 5:
            return JsonResponse(
                {"detail": "Rating must be between 1 and 5"}, status=400
            )

        if not review_text or len(review_text) < 10 or len(review_text) > 4096:
            return JsonResponse(
                {"detail": "Review must be between 10 and 4096 characters"},
                status=400,
            )

        if not drink_id or drink_id == "":
            return JsonResponse({"detail": "Must provide valid drink"}, status=400)

        # check if drink exists
        if not Drink.objects.filter(pk=drink_id).exists():
            return JsonResponse({"detail": f"Drink does not exist"}, status=404)

        drink = Drink.objects.get(pk=drink_id)

        # get date
        date_created = timezone.now()

        review = Review(
            date_created=date_created,
            rating=int(rating),
            review_text=review_text,
            drink=drink,
            profile=profile,
        )

        review.save()

        # add image
        if image:
            drink_image = DrinkImage(
                label=f"{drink.product_name}", image=image, drink=drink
            )
            drink_image.save()

            review_image = ReviewImage(review=review, image=drink_image)
            review_image.save()

        return JsonResponse(ReviewSerializer(review).data)

    def delete(self, request, review_id):
        """
        Delete review with id review_id
        Must be author to delete
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        review = None

        # check if review exists
        try:
            review = Review.objects.get(pk=review_id)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Review with id {review_id} not found"}, status=404
            )

        # check if user is creator of review
        if profile.pk != review.profile.pk:
            return JsonResponse(
                {"detail": f"Must be creator of review {review_id} to delete"},
                status=403,
            )

        # get data
        data = ReviewSerializer(review).data

        # delete review
        review.delete()

        return JsonResponse(data)


class CommentDetail(APIView):
    """
    Detail comment
    """

    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser]

    def get(self, request, comment_id):
        """
        Get comment with id comment_id
        """
        comment = None

        # check if comment exists
        try:
            comment = Comment.objects.get(pk=comment_id)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Comment with id {comment_id} not found"}, status=404
            )

        return JsonResponse(CommentSerializer(comment).data)

    def post(self, request):
        """
        Post comment
        Form data should include comment_text: string, review_id: string
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        # get request data
        comment_text = request.data.get("comment_text")
        review_id = request.data.get("review_id")

        # check if comment has text
        if not comment_text:
            return JsonResponse({"detail": "Comments can not be empty"}, status=400)

        # check comment length
        if len(comment_text) < 1 or len(comment_text) > 280:
            return JsonResponse(
                {"detail": "Comment text must be between 1 and 280 characters"},
                status=400,
            )

        # check if review exists
        if not review_id:
            return JsonResponse({"detail": "Must provide review"}, status=400)

        if not Review.objects.filter(pk=review_id).exists():
            return JsonResponse(
                {"detail": f"Review with id {review_id} does not exist"},
                status=404,
            )

        # check if user has already made this comment
        if Comment.objects.filter(
            profile_id=profile.pk, comment_text=comment_text, review_id=review_id
        ):
            return JsonResponse(
                {"detail": f"You have already made this comment on this review"},
                status=400,
            )

        # get date
        date = timezone.now()

        # create comment
        comment = Comment(date_created=date, comment_text=comment_text)
        comment.review_id = review_id
        comment.profile_id = profile.pk

        comment.save()

        return JsonResponse(CommentSerializer(comment).data)

    def delete(self, request, comment_id):
        """
        Delete comment with id comment_id
        Must be author to delete
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        comment = None

        # check if comment exists
        try:
            comment = Comment.objects.get(pk=comment_id)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Comment with id {comment_id} not found"},
                status=404,
            )

        # check if user is creator of comment
        if profile.pk != comment.profile_id:
            return JsonResponse(
                {"detail": f"Must be creator of comment {comment_id} to delete"},
                status=403,
            )

        # serialize
        data = CommentSerializer(comment).data

        # delete
        comment.delete()

        return JsonResponse(data)


class CommentLikeDetail(APIView):
    """
    Detail comment like
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        """
        Post comment like with authenticated profile and comment_id
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        if not Comment.objects.filter(pk=comment_id):
            return JsonResponse({"detail": "Comment not found"}, status=404)

        try:
            Comment.objects.get(pk=comment_id)
        except ObjectDoesNotExist:
            return JsonResponse({"detail": "Comment not found"}, status=404)

        # check if like exists
        if CommentLike.objects.filter(
            comment_id=comment_id, profile_id=profile.pk
        ).exists():
            return JsonResponse(
                {
                    "detail": f"Profile {profile.pk} has already liked comment {comment_id}"
                },
                status=409,
            )

        # create like
        like = CommentLike()
        like.comment_id = comment_id
        like.profile_id = profile.pk

        like.save()

        return JsonResponse(CommentLikeSerializer(like).data)

    def delete(self, request, comment_id):
        """
        Delete comment like with authenticated profile and comment_id
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        try:
            Comment.objects.get(pk=comment_id)
        except ObjectDoesNotExist:
            return JsonResponse({"detail": "Comment not found"}, status=404)

        # check if like exists
        like = None

        try:
            like = CommentLike.objects.get(comment_id=comment_id, profile_id=profile.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Profile {profile.pk} has not liked comment {comment_id}"},
                status=404,
            )

        # serialize
        data = CommentLikeSerializer(like).data

        # delete
        like.delete()

        return JsonResponse(data)


class ReviewLikeDetail(APIView):
    """
    Detail review like
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, review_id):
        """
        Post review like with authenticated profile and review_id
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        # check if review exists
        if not Review.objects.filter(pk=review_id):
            return JsonResponse({"detail": "Review not found"}, status=404)

        # check if like exists
        if ReviewLike.objects.filter(
            review_id=review_id, profile_id=profile.pk
        ).exists():
            return JsonResponse(
                {
                    "detail": f"Profile {profile.pk} has already liked review {review_id}"
                },
                status=409,
            )

        # create like
        like = ReviewLike()
        like.review_id = review_id
        like.profile_id = profile.pk

        like.save()

        return JsonResponse(ReviewLikeSerializer(like).data)

    def delete(self, request, review_id):
        """
        Delete review like with authenticated profile and review_id
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        # check if review exists
        if not Review.objects.filter(pk=review_id):
            return JsonResponse({"detail": "Review not found"}, status=404)

        # check if like exists
        like = None

        try:
            like = ReviewLike.objects.get(review_id=review_id, profile_id=profile.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Profile {profile.pk} has not liked review {review_id}"},
                status=409,
            )

        # serialize
        data = ReviewLikeSerializer(like).data

        # delete
        like.delete()

        return JsonResponse(data)

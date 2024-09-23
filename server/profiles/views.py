import json
from string import ascii_letters, digits
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.core.validators import validate_email
from django.utils import timezone
from .serializers import (
    FollowSerializer,
    ProfileSerializer,
    UserLimitedSerializer,
    UserSerializer,
)
from .models import Profile, Follow
from django.core.paginator import Paginator
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.contrib.auth.password_validation import validate_password
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView


# util functions
def validate_username(username):
    if username == None or len(username) < 4 or len(username) > 30:
        raise ValidationError("Username must be between 4 and 30 characters")
    elif len(username.split()) != 1:
        raise ValidationError("Username can not contain spaces")
    elif set(username).difference(ascii_letters + digits + "_"):
        raise ValidationError("Username must be made up of a-z, 1-9, _")


def format_user_profile(user, profile, limited=True):
    if limited:
        return {
            "profile": ProfileSerializer(profile).data,
            "user": UserLimitedSerializer(user).data,
        }
    else:
        return {
            "profile": ProfileSerializer(profile).data,
            "user": UserSerializer(user).data,
        }


@api_view(["POST"])
@parser_classes([MultiPartParser])
def login_user(request):
    username = request.POST.get("username")
    password = request.POST.get("password")

    if username is None or password is None:
        return JsonResponse(
            {"detail": "Must provide username and password"}, status=400
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"detail": "Invalid credentials"}, status=400)

    try:
        profile = Profile.objects.get(user_id=user.pk)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"detail": "User does not have corresponding profile"}, status=403
        )

    login(request, user)

    return JsonResponse(format_user_profile(user, profile, limited=False))


@api_view(["POST"])
def logout_user(request):
    logout(request)
    return JsonResponse({"detail": "Successfully logged out"})


class IsAuthenticatedOrPost(BasePermission):
    """
    Permission class for restricting all methods except post
    """

    def has_permission(self, request, view):
        if request.method == "POST":
            return True
        else:
            return request.user and request.user.is_authenticated


class AuthenticatedProfileDetail(APIView):
    """
    Detail authenticated user
    """

    permission_classes = [IsAuthenticatedOrPost]

    def get(self, request):
        """
        Get authenticated user
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

        # include user personal details
        return JsonResponse(format_user_profile(user, profile, limited=False))

    def post(self, request):
        """
        Post new user
        Form data should include email: string, username: string, password: string, image: file
        """
        if request.user.is_authenticated:
            return JsonResponse(
                {"detail": "Log out before creating new user"}, status=403
            )

        # get request data
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")

        profile_img = None

        try:
            profile_img = request.FILES.get("image")
        except:
            profile_img = None

        # check if data is defined/meets requirements
        try:
            validate_email(email)
        except ValidationError as e:
            return JsonResponse({"detail": str(e)}, status=400)

        try:
            validate_username(username)
        except ValidationError as e:
            return JsonResponse({"detail": e.message}, status=400)

        # check for existing email
        if User.objects.filter(email=email).exists():
            return JsonResponse({"detail": "Email is already in use"}, status=409)

        # check for existing username
        if User.objects.filter(username=username).exists():
            return JsonResponse({"detail": "Username is already in use"}, status=409)

        # create user
        user = User(email=email, username=username)

        if not password:
            return JsonResponse({"detail": "Must provide password"}, status=400)

        try:
            validate_password(password)
            user.set_password(password)
        except ValidationError as e:
            return JsonResponse({"detail": str(e)}, status=400)

        profile = Profile(user=user, profile_img=profile_img)

        user.save()
        profile.save()

        # login
        user = authenticate(username=username, password=password)

        login(request, user)

        # include user personal details
        return JsonResponse(format_user_profile(user, profile, limited=False))

    def put(self, request):
        """
        Put authenticated user
        Form data should include password: string, optional username: string, optional email: string, optional image: file
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
        email = request.data.get("email")
        username = request.data.get("username")
        new_password = request.data.get("new_password")
        password = request.data.get("password")

        profile_img = None

        try:
            profile_img = request.FILES.get("image")
        except:
            profile_img = None

        # make sure passwords match
        if not authenticate(username=user.username, password=password):
            return JsonResponse({"detail": "Incorrect Password"}, status=400)

        # update user based on data
        if email and len(email) > 0:
            valid_email = False

            # check for existing email
            try:
                user_with_email = User.objects.get(email=email)

                # allow setting email that is the same as user's existing email
                if user_with_email.pk == user.pk:
                    valid_email = True
            except ObjectDoesNotExist:
                valid_email = True

            try:
                validate_email(email)
            except ValidationError as e:
                return JsonResponse({"detail": str(e)}, status=400)

            if valid_email:
                user.email = email
            else:
                return JsonResponse({"detail": "Email is already in use"}, status=409)

        if username and len(username) > 0:
            try:
                validate_username(username)
            except ValidationError as e:
                return JsonResponse({"detail": e.message}, status=400)

            # check for existing username
            try:
                user_with_username = User.objects.get(username=username)

                # allow setting username that is the same as user's existing username
                if user_with_username.pk != user.pk:
                    return JsonResponse(
                        {"detail": "Username is already in use"}, status=409
                    )
            except ObjectDoesNotExist:
                pass

            user.username = username

        if new_password and len(new_password) > 0:
            try:
                validate_password(new_password)
                user.set_password(new_password)
            except ValidationError as e:
                return JsonResponse({"detail": str(e)}, status=400)

        if profile_img:
            profile.profile_img = profile_img
            profile.profile_img.save()

        user.save()

        # include user personal details
        return JsonResponse(format_user_profile(user, profile, limited=False))

    def delete(self, request):
        # check if user is logged in
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=401
            )

        # check password
        password = request.data.get("password")

        if not password or len(password) == 0:
            return JsonResponse(
                {"detail": "Must provide password to delete user"}, status=400
            )

        if not authenticate(username=user.username, password=password):
            return JsonResponse({"detail": "Incorrect Password"}, status=400)

        data = format_user_profile(user, profile)

        logout(request)
        user.delete()

        return JsonResponse({"profile": data})


class ProfileDetail(APIView):
    """
    Detail profile
    """

    parser_classes = [MultiPartParser]

    def get(self, request, profile_id):
        """
        Get profile with id profile_id
        """
        # check if user exists
        profile = None
        try:
            profile = Profile.objects.get(pk=profile_id)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"User with id {profile_id} not found"}, status=404
            )

        user = User.objects.get(pk=profile.user_id)

        return JsonResponse(format_user_profile(user, profile))


class ProfileList(APIView):
    """
    List profiles
    """

    def get(self, request):
        """
        Get profiles
        Optional query params - page: int, search: string
        """
        profiles = Profile.objects.all()

        users = User.objects.filter(profile__in=profiles)

        # check queries
        page = request.query_params.get("page")
        search = request.query_params.get("search")

        if search:
            users = users.filter(username__icontains=search)

        # set page to 1 if no page provided
        if not page:
            page = 1

        try:
            page = int(page)
        except ValueError:
            return JsonResponse({"detail": "page must be an integer"})

        # order users
        users = users.order_by("id")

        paginator = Paginator(users, 10, 4)
        page_obj = paginator.get_page(page)

        # get matching profiles
        response = []
        for user in page_obj.object_list:
            profile = Profile.objects.get(user_id=user.pk)
            response.append(format_user_profile(user, profile))

        return JsonResponse({"profiles": response, "num_pages": paginator.num_pages})


class FollowDetail(APIView):
    """
    Detail follow
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, following_id):
        """
        Post follow with follower = authenticated profile and following = following_id
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

        # check if requested following exists
        try:
            Profile.objects.get(pk=following_id)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Profile with id {following_id} not found"},
                status=404,
            )
        current_date = timezone.now()

        # check if following and follower are the same
        if profile.pk == following_id:
            return JsonResponse("Profile can not follow themselves", status=406)

        # check if follow relationship already exists
        if Follow.objects.filter(
            following_id=following_id, follower_id=profile.pk
        ).exists():
            return JsonResponse(
                {
                    "detail": f"Profile {profile.pk} already follows profile {following_id}"
                },
                status=409,
            )

        # create follow object
        follow = Follow(date_created=current_date)
        follow.follower_id = profile.pk
        follow.following_id = following_id

        follow.save()

        return JsonResponse(FollowSerializer(follow).data)

    def delete(self, request, following_id):
        """
        Delete follow with follower = authenticated profile and following = following_id
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

        # check if requested follow exists
        follow = None

        try:
            follow = Follow.objects.get(
                following_id=following_id, follower_id=profile.pk
            )
        except ObjectDoesNotExist:
            return JsonResponse(
                {
                    "detail": f"Profile {profile.pk} is not following profile {following_id}"
                },
                status=404,
            )

        data = FollowSerializer(follow).data

        # delete
        follow.delete()

        return JsonResponse(data)


class FollowList(APIView):
    """
    List follow
    """

    def get(self, request):
        """
        Get follows
        Optional query params - following: int, follower: int
        """
        follows = Follow.objects.all()

        # check for following
        following = request.query_params.get("following")
        if following:
            # check profile exists
            if not Profile.objects.filter(pk=following).exists():
                return JsonResponse(
                    {"detail": f"Profile with id {following} not found"}, status=404
                )

            follows = follows.filter(following_id=following)

        # check for follower
        follower = request.query_params.get("follower")
        if follower:
            # check if profile exists
            # check profile exists
            if not Profile.objects.filter(pk=follower).exists():
                return JsonResponse(
                    {"detail": f"Profile with id {follower} not found"}, status=404
                )

            follows = follows.filter(follower_id=follower)

        return JsonResponse({"follows": FollowSerializer(follows, many=True).data})

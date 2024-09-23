from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from PIL import Image
from profiles.models import Profile
from .serializers import DrinkFavoriteSerializer, DrinkImageSerializer, DrinkSerializer
from .models import Drink, DrinkFavorite, DrinkImage
from django.utils import timezone
from django.core.paginator import Paginator
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser


class DrinkList(APIView):
    """
    List drinks
    """

    def get(self, request):
        """
        List drinks with query params - search: string, page: int
        """
        drinks = Drink.objects.all()

        # check queries
        page = request.query_params.get("page")
        search = request.query_params.get("search")

        if search:
            drinks = drinks.filter(
                Q(product_name__icontains=search) | Q(brand_name__icontains=search)
            )

        # set page to 1 if no page provided
        if not page:
            page = 1

        try:
            page = int(page)
        except ValueError:
            return JsonResponse({"detail": "page must be an integer"})

        # order drinks
        drinks = drinks.order_by("id")

        paginator = Paginator(drinks, 10, 4)
        page_obj = paginator.get_page(page)

        return JsonResponse(
            {
                "drinks": DrinkSerializer(page_obj.object_list, many=True).data,
                "page": page,
                "num_pages": paginator.num_pages,
            }
        )


class ImageList(APIView):
    """
    List drink images
    """

    def get(self, request):
        """
        List drink images with query params - drink: int
        """
        drink_images = DrinkImage.objects.all()

        # check for drink
        drink_id = request.query_params.get("drink")
        if drink_id:
            if Drink.objects.filter(pk=drink_id).exists():
                drink_images = drink_images.filter(drink_id=drink_id)
            else:
                return JsonResponse({"detail": "Drink not found"}, status=404)

        return JsonResponse(
            {"images": DrinkImageSerializer(drink_images, many=True).data}
        )


class FavoriteList(APIView):
    """
    List drink favorites
    """

    def get(self, request):
        """
        List drink favorites with query params - profile: int, drink: int
        """
        favorites = DrinkFavorite.objects.all()

        # check for profile
        profile_id = request.query_params.get("profile")

        if profile_id:
            if Profile.objects.filter(pk=profile_id).exists():
                favorites = favorites.filter(profile_id=profile_id)
            else:
                return JsonResponse({"detail": "Profile not found"}, status=404)

        # check for drink
        drink_id = request.GET.get("drink")

        if drink_id:
            if Drink.objects.filter(pk=drink_id).exists():
                favorites = favorites.filter(drink_id=drink_id)
            else:
                return JsonResponse({"detail": "Drink not found"}, status=404)

        return JsonResponse(
            {"favorites": DrinkFavoriteSerializer(favorites, many=True).data}
        )


class DrinkDetail(APIView):
    """
    Detail drink
    """

    parser_classes = [MultiPartParser]

    def get(self, request, drink_id=None):
        """
        Get drink with id drink_id
        """
        drink = None

        # check if drink exists
        try:
            drink = Drink.objects.get(pk=drink_id)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Drink with id {drink_id} not found"}, status=404
            )

        return JsonResponse(DrinkSerializer(drink).data)

    def post(self, request):
        """
        Post new drink
        Form data should include product_name, brand_name, any number of image files
        """
        product_name = request.data.get("product_name")
        brand_name = request.data.get("brand_name")
        files = request.FILES

        images = []

        for file_name in files:
            try:
                file = files.get(file_name)

                Image.open(file)
                images.append(file)
            except Exception as e:
                return JsonResponse({"detail": "Files must be images"}, status=400)

        if not product_name:
            return JsonResponse({"detail": "Must provide product_name"}, status=400)

        if not brand_name:
            return JsonResponse({"detail": "Must provide brand_name"}, status=400)

        if Drink.objects.filter(
            product_name=product_name, brand_name=brand_name
        ).exists():
            return JsonResponse(
                {"detail": "Drink already exists with this name and brand"},
                status=409,
            )

        drink = Drink(product_name=product_name, brand_name=brand_name)

        drink.save()

        for image in images:
            drink_image = DrinkImage(
                label=f"{product_name} - {brand_name}", image=image, drink=drink
            )
            drink_image.save()

        return JsonResponse(DrinkSerializer(drink).data)

    def delete(self, request, drink_id=None):
        """
        Delete drink with id drink_id
        """
        drink = None

        # check if drink exists
        try:
            drink = Drink.objects.get(pk=drink_id)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Drink with id {drink_id} not found"}, status=404
            )

        # serialize
        data = DrinkSerializer(drink).data

        # delete
        drink.delete()

        return JsonResponse(data)


class FavoriteDetail(APIView):
    """
    Detail drink favorites
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, drink_id):
        """
        Post drink favorite with authenticated profile and drink with drink_id
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=403
            )

        # check if drink exists
        if not Drink.objects.filter(pk=drink_id).exists():
            return JsonResponse(
                {"detail": f"Drink with id {drink_id} not found"}, status=404
            )

        # check if favorite relationship already exists
        if DrinkFavorite.objects.filter(
            profile_id=profile.pk, drink_id=drink_id
        ).exists():
            return JsonResponse(
                {
                    "detail": f"User {profile.pk} already has drink {drink_id} in favorites"
                },
                status=409,
            )

        # get date
        date = timezone.now()

        # create favorite relationship
        favorite = DrinkFavorite(date_created=date)
        favorite.drink_id = drink_id
        favorite.profile_id = profile.pk

        favorite.save()

        return JsonResponse(DrinkFavoriteSerializer(favorite).data)

    def delete(self, request, drink_id):
        """
        Delete drink favorite with authenticated profile and drink with drink_id
        """
        user = request.user

        # check user has profile
        profile = None

        try:
            profile = Profile.objects.get(user_id=user.pk)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": "User does not have connected profile"}, status=403
            )

        # check if drink exists
        if not Drink.objects.filter(pk=drink_id).exists():
            return JsonResponse(
                {"detail": f"Drink with id {drink_id} not found"}, status=404
            )

        # check if requested favorite exists
        favorite = None

        try:
            favorite = DrinkFavorite.objects.get(
                profile_id=profile.pk, drink_id=drink_id
            )
        except ObjectDoesNotExist:
            return JsonResponse(
                {"detail": f"Drink {drink_id} is not in user {profile.pk} favorites"},
                status=404,
            )

        # serialize
        data = DrinkFavoriteSerializer(favorite).data

        # delete
        favorite.delete()

        return JsonResponse(data)

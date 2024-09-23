import json
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from profiles.models import Profile
from .models import Drink, DrinkFavorite
from django.utils import timezone


class TestDrinkDetailPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        self.url = "/drinks/drink/"

        # create admin user
        self.admin_username = "admin_user"
        self.admin_pass = "pass_for_admin_user"
        admin_user = User(username=self.admin_username, is_staff=True)
        admin_user.set_password(self.admin_pass)

        admin_user.save()

        # create regular user
        self.normal_username = "normal_user"
        self.normal_pass = "pass_for_normal_user"
        user = User(username=self.normal_username)
        user.set_password(self.normal_pass)

        user.save()

        # drink data
        self.data_no_product = {"brand_name": "Test Brand"}

        self.data_no_brand = {"product_name": "Test Product"}

        self.data_good = {"brand_name": "Test Brand", "product_name": "Test Product"}

    def test_reject_not_admin(self):
        # login
        self.client.login(username=self.normal_username, password=self.normal_pass)

        # request
        response = self.client.post(self.url, self.data_good, format="multipart")

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, len(Drink.objects.all()))

    def test_reject_bad_product_name(self):
        # login
        self.client.login(username=self.normal_username, password=self.normal_pass)

        # request
        response = self.client.post(self.url, self.data_no_product, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Drink.objects.all()))

    def test_reject_bad_brand_name(self):
        # login
        self.client.login(username=self.normal_username, password=self.normal_pass)

        # request
        response = self.client.post(self.url, self.data_no_brand, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(0, len(Drink.objects.all()))

    def test_reject_non_image_files(self):
        pass

    def test_reject_duplicate(self):
        # create object
        Drink.objects.create(
            product_name=self.data_good["product_name"],
            brand_name=self.data_good["brand_name"],
        )

        # login
        self.client.login(username=self.normal_username, password=self.normal_pass)

        # request
        response = self.client.post(self.url, self.data_good, format="multipart")

        self.assertEqual(
            409,
            response.status_code,
        )
        self.assertEqual(
            1,
            len(
                Drink.objects.filter(
                    product_name=self.data_good["product_name"],
                    brand_name=self.data_good["brand_name"],
                )
            ),
        )

    def test_create_drink(self):
        # login
        self.client.login(username=self.normal_username, password=self.normal_pass)

        # request
        response = self.client.post(self.url, self.data_good, format="multipart")
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertSetEqual(
            set(["id", "product_name", "brand_name"]), set(response_json.keys())
        )
        self.assertDictContainsSubset(self.data_good, response_json)
        self.assertEqual(
            1,
            len(
                Drink.objects.filter(
                    product_name=self.data_good["product_name"],
                    brand_name=self.data_good["brand_name"],
                )
            ),
        )


class TestDrinkDetailDELETE(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create admin user
        self.admin_username = "admin_user"
        self.admin_pass = "pass_for_admin_user"
        admin_user = User(username=self.admin_username, is_staff=True)
        admin_user.set_password(self.admin_pass)

        admin_user.save()

        # create regular user
        self.normal_username = "normal_user"
        self.normal_pass = "pass_for_normal_user"
        user = User(username=self.normal_username)
        user.set_password(self.normal_pass)

        user.save()

        # drink
        brand_name = "Test Brand"
        product_name = "Product Name"

        drink = Drink.objects.create(product_name=product_name, brand_name=brand_name)
        self.data = {
            "id": drink.pk,
            "brand_name": brand_name,
            "product_name": product_name,
        }

        self.good_url = f"/drinks/drink/{drink.pk}/"
        self.no_drink_url = f"/drinks/drink/{drink.pk + 1}/"

    def test_reject_not_admin(self):
        # login
        self.client.login(username=self.normal_username, password=self.normal_pass)

        # request
        response = self.client.delete(self.good_url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(Drink.objects.all()))

    def test_reject_drink_not_found(self):
        # login
        self.client.login(username=self.admin_username, password=self.admin_pass)

        # request
        response = self.client.delete(self.no_drink_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(Drink.objects.all()))

    def test_delete_drink(self):
        # login
        self.client.login(username=self.admin_username, password=self.admin_pass)

        # request
        response = self.client.delete(self.good_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertDictEqual(self.data, response_json)
        self.assertEqual(0, len(Drink.objects.all()))


class TestDrinkDetailGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # drink
        brand_name = "Test Brand"
        product_name = "Product Name"

        drink = Drink.objects.create(product_name=product_name, brand_name=brand_name)
        self.data = {
            "id": drink.pk,
            "brand_name": brand_name,
            "product_name": product_name,
        }

        self.good_url = f"/drinks/drink/{drink.pk}/"
        self.no_drink_url = f"/drinks/drink/{drink.pk + 1}/"

    def test_reject_drink_not_found(self):
        # request
        response = self.client.get(self.no_drink_url)

        self.assertEqual(404, response.status_code)

    def test_get_drink(self):
        # request
        response = self.client.get(self.good_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertDictEqual(self.data, response_json)


class TestFavoriteDetailPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user without a profile
        self.no_profile_username = "no_profile_user"
        self.no_profile_pass = "pass_for_no_profile_user"
        user = User(username=self.no_profile_username)
        user.set_password(self.no_profile_pass)

        user.save()

        # create user/profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        user = User(username=self.profile_username)
        user.set_password(self.profile_pass)

        user.save()
        profile = Profile.objects.create(user=user)

        # create drink
        brand_name = "Test Brand"
        product_name = "Product Name"

        drink = Drink.objects.create(product_name=product_name, brand_name=brand_name)

        # favorite data
        self.data = {"drink_id": drink.pk, "profile_id": profile.pk}

        self.good_url = f"/drinks/drink/{drink.pk}/favorite/"
        self.no_drink_url = f"/drinks/drink/{drink.pk + 1}/favorite/"

    def test_reject_no_user(self):
        # request
        response = self.client.post(self.good_url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, len(DrinkFavorite.objects.all()))

    def test_reject_no_profile(self):
        # login
        self.client.login(
            username=self.no_profile_username, password=self.no_profile_pass
        )

        # request
        response = self.client.post(self.good_url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, len(DrinkFavorite.objects.all()))

    def test_reject_drink_not_found(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.post(self.no_drink_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(0, len(DrinkFavorite.objects.all()))

    def test_reject_duplicate(self):
        # create favorite
        DrinkFavorite.objects.create(
            profile_id=self.data["profile_id"],
            drink_id=self.data["drink_id"],
            date_created=timezone.now(),
        )

        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.post(self.good_url)

        self.assertEqual(409, response.status_code)
        self.assertEqual(1, len(DrinkFavorite.objects.all()))

    def test_create_favorite(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.post(self.good_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertSetEqual(
            set(["id", "drink_id", "profile_id"]), set(response_json.keys())
        )
        self.assertDictContainsSubset(self.data, response_json)
        self.assertEqual(1, len(DrinkFavorite.objects.all()))


class TestFavoriteDetailDELETE(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user without a profile
        self.no_profile_username = "no_profile_user"
        self.no_profile_pass = "pass_for_no_profile_user"
        user = User(username=self.no_profile_username)
        user.set_password(self.no_profile_pass)

        user.save()

        # create right user/profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        user = User(username=self.profile_username)
        user.set_password(self.profile_pass)

        user.save()
        profile = Profile.objects.create(user=user)

        # create drink
        brand_name = "Test Brand"
        product_name = "Product Name"

        drink = Drink.objects.create(product_name=product_name, brand_name=brand_name)

        # favorite
        self.data = {"drink_id": drink.pk, "profile_id": profile.pk}
        self.favorite = DrinkFavorite.objects.create(
            profile_id=self.data["profile_id"],
            drink_id=self.data["drink_id"],
            date_created=timezone.now(),
        )

        # extra drink
        extra_drink = Drink.objects.create(
            product_name="Product 2", brand_name="Brand 2"
        )

        # urls
        self.good_url = f"/drinks/drink/{drink.pk}/favorite/"
        self.no_drink_url = f"/drinks/drink/{drink.pk + extra_drink.pk}/favorite/"
        self.no_favorite_url = f"/drinks/drink/{extra_drink.pk}/favorite/"

    def test_reject_no_user(self):
        # request
        response = self.client.delete(self.good_url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(DrinkFavorite.objects.all()))

    def test_reject_no_profile(self):
        # login
        self.client.login(
            username=self.no_profile_username, password=self.no_profile_pass
        )

        # request
        response = self.client.delete(self.good_url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(DrinkFavorite.objects.all()))

    def test_reject_drink_not_found(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.delete(self.no_drink_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(DrinkFavorite.objects.all()))

    def test_reject_favorite_not_found(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.delete(self.no_favorite_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(DrinkFavorite.objects.all()))

    def test_delete_favorite(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.delete(self.good_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(DrinkFavorite.objects.all()))
        self.assertSetEqual(
            set(["id", "profile_id", "drink_id"]), set(response_json.keys())
        )
        self.assertDictContainsSubset(self.data, response_json)


class TestDrinkListGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create drinks
        self.drinks = []

        for i in range(10):
            product_name = f"Product {i}"
            brand_name = f"Brand {i}"

            self.drinks.append({"product_name": product_name, "brand_name": brand_name})

            Drink.objects.create(product_name=product_name, brand_name=brand_name)

        for i in range(10):
            product_name = f"Special Product {i}"
            brand_name = f"Brand {i}"

            self.drinks.append({"product_name": product_name, "brand_name": brand_name})

            Drink.objects.create(product_name=product_name, brand_name=brand_name)

        self.all_url = "/drinks/"
        self.search_url = f"/drinks/?search=special"
        self.page_url = f"/drinks/?page=2"

    def test_get_search(self):
        # request
        response = self.client.get(self.search_url)
        response_json = json.loads(response.content)

        expected_drinks = [
            drink for drink in self.drinks if "special" in drink["product_name"].lower()
        ]

        self.assertEqual(200, response.status_code)
        self.assertEqual(1, response_json["num_pages"])
        self.assertEqual(10, len(response_json["drinks"]))

        for i in range(len(expected_drinks)):
            expected = expected_drinks[i]
            actual = response_json["drinks"][i]

            self.assertSetEqual(
                set(["id", "product_name", "brand_name"]), set(actual.keys())
            )
            self.assertDictContainsSubset(expected, actual)

    def test_get_page(self):
        # request
        response = self.client.get(self.page_url)
        response_json = json.loads(response.content)

        expected_drinks = self.drinks[-10:]

        self.assertEqual(200, response.status_code)
        self.assertEqual(2, response_json["num_pages"])
        self.assertEqual(10, len(response_json["drinks"]))

        for i in range(int(len(expected_drinks) / 2)):
            expected = expected_drinks[i]
            actual = response_json["drinks"][i]

            self.assertSetEqual(
                set(["id", "product_name", "brand_name"]), set(actual.keys())
            )
            self.assertDictContainsSubset(expected, actual)

    def test_get_drinks(self):
        # request
        response = self.client.get(self.all_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(2, response_json["num_pages"])
        self.assertEqual(10, len(response_json["drinks"]))

        for i in range(int(len(self.drinks) / 2)):
            expected = self.drinks[i]
            actual = response_json["drinks"][i]

            self.assertSetEqual(
                set(["id", "product_name", "brand_name"]), set(actual.keys())
            )
            self.assertDictContainsSubset(expected, actual)


class TestImageListGET(APITestCase):
    def test_get_drink(self):
        pass

    def test_get_all(self):
        pass


class TestFavoriteListGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create drinks
        self.drink_objs = []

        for i in range(10):
            product_name = f"Product {i}"
            brand_name = f"Brand {i}"

            self.drink_objs.append(
                Drink.objects.create(product_name=product_name, brand_name=brand_name)
            )

        # create users/profiles
        self.profile_objs = []

        for i in range(10):
            username = f"username_{i}"
            password = f"pass_for_user_{i}"

            user = User(username=username)
            user.set_password(password)
            user.save()

            self.profile_objs.append(Profile.objects.create(user=user))

        # create favorites

        self.favorites = []

        for i in range(len(self.profile_objs)):
            profile_id = self.profile_objs[i].pk

            for j in range(4):
                drink_id = self.drink_objs[j].pk

                self.favorites.append({"profile_id": profile_id, "drink_id": drink_id})

                DrinkFavorite.objects.create(
                    profile_id=profile_id,
                    drink_id=drink_id,
                    date_created=timezone.now(),
                )

        # urls
        self.all_url = "/drinks/favorites/"
        self.drink_url = f"/drinks/favorites/?drink={self.drink_objs[0].pk}"
        self.profile_url = f"/drinks/favorites/?profile={self.profile_objs[0].pk}"

    def test_get_drink(self):
        # request
        response = self.client.get(self.drink_url)
        response_json = json.loads(response.content)

        expected_favorites = [
            favorite
            for favorite in self.favorites
            if self.drink_objs[0].pk == favorite["drink_id"]
        ]

        self.assertEqual(200, response.status_code)
        self.assertEqual(len(expected_favorites), len(response_json["favorites"]))

        for i in range(len(expected_favorites)):
            expected = expected_favorites[i]
            actual = response_json["favorites"][i]

            self.assertSetEqual(
                set(["id", "profile_id", "drink_id"]), set(actual.keys())
            )
            self.assertDictContainsSubset(expected, actual)

    def test_get_profile(self):
        # request
        response = self.client.get(self.profile_url)
        response_json = json.loads(response.content)

        expected_favorites = [
            favorite
            for favorite in self.favorites
            if self.profile_objs[0].pk == favorite["profile_id"]
        ]

        self.assertEqual(200, response.status_code)
        self.assertEqual(len(expected_favorites), len(response_json["favorites"]))

        for i in range(len(expected_favorites)):
            expected = expected_favorites[i]
            actual = response_json["favorites"][i]

            self.assertSetEqual(
                set(["id", "profile_id", "drink_id"]), set(actual.keys())
            )
            self.assertDictContainsSubset(expected, actual)

    def test_get_all(self):
        # request
        response = self.client.get(self.all_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(len(self.favorites), len(response_json["favorites"]))

        for i in range(len(self.favorites)):
            expected = self.favorites[i]
            actual = response_json["favorites"][i]

            self.assertSetEqual(
                set(["id", "profile_id", "drink_id"]), set(actual.keys())
            )
            self.assertDictContainsSubset(expected, actual)

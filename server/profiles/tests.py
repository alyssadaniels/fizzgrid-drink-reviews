import json
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, get_user as auth_get_user
from .models import Follow, Profile
from django.utils import timezone


class TestLoginPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user without profile
        self.no_profile_username = "no_profile_user"
        self.no_profile_pass = "pass_for_no_profile_user"
        no_profile_user = User(username=self.no_profile_username, is_staff=True)
        no_profile_user.set_password(self.no_profile_pass)

        no_profile_user.save()

        # create user with profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        profile_user = User(username=self.profile_username, email="email@email.com")
        profile_user.set_password(self.profile_pass)

        profile_user.save()
        Profile.objects.create(user=profile_user)

        # data
        self.profile_data = {"user_id": profile_user.pk}

        self.user_data = {
            "username": profile_user.username,
            "email": profile_user.email,
        }

        self.url = "/profiles/login/"

    def test_reject_no_username(self):
        # not included
        body = {"password": self.profile_pass}

        # request
        response = self.client.post(self.url, body, format="multipart")
        user = auth_get_user(self.client)

        self.assertEqual(400, response.status_code)
        self.assertFalse(user.is_authenticated)

        # empty
        body = {"username": "", "password": self.profile_pass}

        # request
        response = self.client.post(self.url, body, format="multipart")
        user = auth_get_user(self.client)

        self.assertEqual(400, response.status_code)
        self.assertFalse(user.is_authenticated)

    def test_reject_no_password(self):
        # not included
        body = {"username": self.profile_username}

        # request
        response = self.client.post(self.url, body, format="multipart")
        user = auth_get_user(self.client)

        self.assertEqual(400, response.status_code)
        self.assertFalse(user.is_authenticated)

        # empty
        body = {"username": self.profile_username, "password": ""}

        # request
        response = self.client.post(self.url, body, format="multipart")
        user = auth_get_user(self.client)

        self.assertEqual(400, response.status_code)
        self.assertFalse(user.is_authenticated)

    def test_reject_invalid_username(self):
        # body
        body = {"username": "wrong_username", "password": self.profile_pass}

        # request
        response = self.client.post(self.url, body, format="multipart")
        user = auth_get_user(self.client)

        self.assertEqual(400, response.status_code)
        self.assertFalse(user.is_authenticated)

    def test_reject_invalid_password(self):
        # body
        body = {"username": self.profile_username, "password": "wrong_password"}

        # request
        response = self.client.post(self.url, body, format="multipart")
        user = auth_get_user(self.client)

        self.assertEqual(400, response.status_code)
        self.assertFalse(user.is_authenticated)

    def test_reject_no_profile(self):
        # body
        body = {"username": self.no_profile_username, "password": self.no_profile_pass}

        # request
        response = self.client.post(self.url, body, format="multipart")
        user = auth_get_user(self.client)

        self.assertEqual(403, response.status_code)
        self.assertFalse(user.is_authenticated)

    def test_login(self):
        # body
        body = {"username": self.profile_username, "password": self.profile_pass}

        # request
        response = self.client.post(self.url, body, format="multipart")
        user = auth_get_user(self.client)

        self.assertEqual(200, response.status_code)
        self.assertTrue(user.is_authenticated)

        response_json = json.loads(response.content)
        user_data = response_json["user"]
        profile_data = response_json["profile"]

        self.assertSetEqual(
            set(["id", "user_id", "profile_img"]), set(profile_data.keys())
        )
        self.assertDictContainsSubset(self.profile_data, profile_data)
        self.assertDictEqual(self.user_data, user_data)


class TestLogoutPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user with profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        profile_user = User(username=self.profile_username, email="email@email.com")
        profile_user.set_password(self.profile_pass)

        profile_user.save()
        Profile.objects.create(user=profile_user)

        # data
        self.profile_data = {"user_id": profile_user.pk}

        self.user_data = {
            "username": profile_user.username,
            "email": profile_user.email,
        }

        self.url = "/profiles/logout/"

    def test_logout_no_user(self):
        response = self.client.post(self.url)

        self.assertEqual(200, response.status_code)
        self.assertFalse(auth_get_user(self.client).is_authenticated)

    def test_logout(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.post(self.url)

        self.assertEqual(200, response.status_code)
        self.assertFalse(auth_get_user(self.client).is_authenticated)


class TestAuthProfileDetailGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user with profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        profile_user = User(username=self.profile_username, email="email@email.com")
        profile_user.set_password(self.profile_pass)

        profile_user.save()
        Profile.objects.create(user=profile_user)

        # data
        self.profile_data = {"user_id": profile_user.pk}

        self.user_data = {
            "username": profile_user.username,
            "email": profile_user.email,
        }

        self.url = "/profiles/profile/"

    def test_reject_no_user(self):
        response = self.client.get(self.url)

        self.assertEqual(403, response.status_code)

    def test_get_profile(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.get(self.url)
        response_json = json.loads(response.content)
        profile_data = response_json["profile"]
        user_data = response_json["user"]

        self.assertEqual(200, response.status_code)
        self.assertSetEqual(
            set(["id", "user_id", "profile_img"]), set(profile_data.keys())
        )
        self.assertDictContainsSubset(self.profile_data, profile_data)
        self.assertDictEqual(self.user_data, user_data)


class TestAuthProfileDetailPUT(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user with profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        self.profile_user = User(
            username=self.profile_username, email="email@email.com"
        )
        self.profile_user.set_password(self.profile_pass)

        self.profile_user.save()
        Profile.objects.create(user=self.profile_user)

        # data
        self.profile_data = {"user_id": self.profile_user.pk}

        self.user_data = {
            "username": self.profile_user.username,
            "email": self.profile_user.email,
        }

        self.updated_data = {
            "username": "new_username",
            "password": self.profile_pass,
            "new_password": "se4cUUrepass_",
            "email": "email2@email.com",
        }

        self.url = "/profiles/profile/"

    def test_reject_no_user(self):
        # store old encrypted password
        old_pass = self.profile_user.password

        response = self.client.put(self.url, self.updated_data, format="multipart")

        self.assertEqual(403, response.status_code)

        # make sure info did not change
        user = User.objects.get(pk=self.profile_user.pk)

        self.assertEqual(self.user_data["username"], user.username)
        self.assertEqual(self.user_data["email"], user.email)
        self.assertEqual(old_pass, user.password)

    def test_reject_no_password(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # store old encrypted password
        old_pass = self.profile_user.password

        # request no password
        body = {
            "username": "new_username",
            "new_password": "se4cUUrepass_",
            "email": "email2@email.com",
        }

        response = self.client.put(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)

        # make sure info did not change
        user = User.objects.get(pk=self.profile_user.pk)

        self.assertEqual(self.user_data["username"], user.username)
        self.assertEqual(self.user_data["email"], user.email)
        self.assertEqual(old_pass, user.password)

        # request empty password
        body = {
            "username": "new_username",
            "password": "",
            "new_password": "se4cUUrepass_",
            "email": "email2@email.com",
        }

        response = self.client.put(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)

        # make sure info did not change
        user = User.objects.get(pk=self.profile_user.pk)

        self.assertEqual(self.user_data["username"], user.username)
        self.assertEqual(self.user_data["email"], user.email)
        self.assertEqual(old_pass, user.password)

    def test_reject_invalid_password(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # store old encrypted password
        old_pass = self.profile_user.password

        # request
        body = {
            "username": "new_username",
            "password": "wrong_password",
            "new_password": "new_password",
            "email": "email2@email.com",
        }

        response = self.client.put(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)

        # make sure info did not change
        user = User.objects.get(pk=self.profile_user.pk)

        self.assertEqual(self.user_data["username"], user.username)
        self.assertEqual(self.user_data["email"], user.email)
        self.assertEqual(old_pass, user.password)

    def test_update_email(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # store old encrypted password
        old_pass = self.profile_user.password

        # request
        new_email = "email2@email.com"
        body = {
            "password": self.profile_pass,
            "email": new_email,
        }

        response = self.client.put(self.url, body, format="multipart")
        response_json = json.loads(response.content)
        profile_data = response_json["profile"]
        user_data = response_json["user"]

        # check response
        self.assertEqual(200, response.status_code)
        self.assertDictContainsSubset(self.profile_data, profile_data)
        self.assertDictEqual(
            {"username": self.profile_username, "email": new_email}, user_data
        )

        # check data
        user = User.objects.get(pk=self.profile_user.pk)
        self.assertEqual(new_email, user.email)

        # make sure other info did not change
        self.assertEqual(self.user_data["username"], user.username)
        self.assertEqual(old_pass, user.password)

    def test_update_username(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # store old encrypted password
        old_pass = self.profile_user.password

        # request
        new_username = "username2"
        body = {
            "password": self.profile_pass,
            "username": new_username,
        }

        response = self.client.put(self.url, body, format="multipart")
        response_json = json.loads(response.content)
        profile_data = response_json["profile"]
        user_data = response_json["user"]

        # check response
        self.assertEqual(200, response.status_code)
        self.assertDictContainsSubset(self.profile_data, profile_data)
        self.assertDictEqual(
            {"username": new_username, "email": self.user_data["email"]}, user_data
        )

        # check data
        user = User.objects.get(pk=self.profile_user.pk)
        self.assertEqual(new_username, user.username)

        # make sure other info did not change
        self.assertEqual(self.user_data["email"], user.email)
        self.assertEqual(old_pass, user.password)

    def test_update_password(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        new_password = "se4cUUrepass_"
        body = {
            "password": self.profile_pass,
            "new_password": new_password,
        }

        response = self.client.put(self.url, body, format="multipart")
        response_json = json.loads(response.content)
        profile_data = response_json["profile"]
        user_data = response_json["user"]

        # check response
        self.assertEqual(200, response.status_code)
        self.assertDictContainsSubset(self.profile_data, profile_data)
        self.assertDictEqual(self.user_data, user_data)

        # check data
        user = User.objects.get(pk=self.profile_user.pk)

        # make sure other info did not change
        self.assertEqual(self.user_data["email"], user.email)
        self.assertEqual(self.user_data["username"], user.username)

        # user should be logged out
        self.assertFalse(auth_get_user(self.client).is_authenticated)

        # make sure password updated
        user = authenticate(username=self.profile_username, password=new_password)
        self.assertIsNotNone(user)

    def test_update_image(self):
        pass

    def test_update_all(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.put(self.url, self.updated_data, format="multipart")
        response_json = json.loads(response.content)
        profile_data = response_json["profile"]
        user_data = response_json["user"]

        # check response
        self.assertEqual(200, response.status_code)
        self.assertSetEqual(
            set(["id", "user_id", "profile_img"]), set(profile_data.keys())
        )

        expected_user = {
            "email": self.updated_data["email"],
            "username": self.updated_data["username"],
        }

        self.assertDictEqual(expected_user, user_data)

        # check data
        user = User.objects.get(pk=self.profile_user.pk)

        self.assertEqual(self.updated_data["username"], user.username)
        self.assertEqual(self.updated_data["email"], user.email)

        # user should be logged out
        self.assertFalse(auth_get_user(self.client).is_authenticated)

        # make sure password updated
        user = authenticate(
            username=self.profile_username, password=self.updated_data["new_password"]
        )
        self.assertIsNotNone(user)


class TestAuthProfileDetailDELETE(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user with profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        profile_user = User(username=self.profile_username, email="email@email.com")
        profile_user.set_password(self.profile_pass)

        profile_user.save()
        Profile.objects.create(user=profile_user)

        # url
        self.url = "/profiles/profile/"

    def test_reject_no_user(self):
        response = self.client.delete(
            self.url, {"password": self.profile_pass}, format="multipart"
        )

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_no_password(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # no password in body
        response = self.client.delete(self.url, {}, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

        # password length 0
        response = self.client.delete(self.url, {"password": ""}, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_invalid_password(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        response = self.client.delete(
            self.url, {"password": "wrong_password"}, format="multipart"
        )

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_delete_profile(self):
        # login
        self.client.login(username=self.profile_username, password=self.profile_pass)

        response = self.client.delete(
            self.url, {"password": self.profile_pass}, format="multipart"
        )

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(User.objects.all()))
        self.assertEqual(0, len(Profile.objects.all()))

        self.assertFalse(auth_get_user(self.client).is_authenticated)


class TestProfileDetailGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user with profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        profile_user = User(username=self.profile_username, email="email@email.com")
        profile_user.set_password(self.profile_pass)

        profile_user.save()
        profile = Profile.objects.create(user=profile_user)

        # url
        self.good_url = f"/profiles/profile/{profile.pk}/"
        self.bad_url = f"/profiles/profile/{profile.pk + 1}/"

    def test_reject_profile_not_found(self):
        response = self.client.get(self.bad_url)

        self.assertEqual(404, response.status_code)

    def test_get_profile(self):
        response = self.client.get(self.good_url)
        response_json = json.loads(response.content)
        profile_data = response_json["profile"]
        user_data = response_json["user"]

        self.assertEqual(200, response.status_code)
        self.assertSetEqual(
            set(["id", "user_id", "profile_img"]), set(profile_data.keys())
        )
        self.assertDictEqual({"username": self.profile_username}, user_data)


class TestProfileDetailPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create user with profile
        self.profile_username = "profile_user"
        self.profile_pass = "pass_for_profile_user"
        self.profile_email = "email@email.com"
        profile_user = User(username=self.profile_username, email=self.profile_email)
        profile_user.set_password(self.profile_pass)

        profile_user.save()
        profile = Profile.objects.create(user=profile_user)

        # data
        self.data = {
            "email": "myemail@email.com",
            "username": "newusername",
            "password": "123lceajfep30",
        }

        # url
        self.url = "/profiles/profile/"

    def test_reject_user_logged_in(self):
        # log in
        self.client.login(username=self.profile_username, password=self.profile_pass)

        # request
        response = self.client.post(self.url, self.data, format="multipart")

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_no_email(self):
        # no email
        body = {
            "username": "newusername",
            "password": "123lceajfep30",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

        # empty email
        body = {
            "email": "",
            "username": "newusername",
            "password": "123lceajfep30",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_bad_email(self):
        body = {
            "username": "newusername",
            "password": "123lceajfep30",
            "email": "not an email",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_existing_email(self):
        body = {
            "username": "newusername",
            "password": "123lceajfep30",
            "email": self.profile_email,
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(409, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_no_username(self):
        # no username
        body = {
            "email": "myemail@email.com",
            "password": "123lceajfep30",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

        # empty username
        body = {
            "email": "myemail@email.com",
            "username": "",
            "password": "123lceajfep30",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_bad_username(self):
        body = {
            "username": "bad?+ username",
            "password": "123lceajfep30",
            "email": "myemail@email.com",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_existing_username(self):
        body = {
            "username": self.profile_username,
            "password": "123lceajfep30",
            "email": "myemail@email.com",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(409, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_no_password(self):
        # no password
        body = {
            "username": "newusername",
            "email": "myemail@email.com",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

        # empty password
        body = {
            "username": "newusername",
            "email": "myemail@email.com",
            "password": "",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_bad_password(self):
        body = {
            "username": "newusername",
            "password": "password",
            "email": "myemail@email.com",
        }

        # request
        response = self.client.post(self.url, body, format="multipart")

        self.assertEqual(400, response.status_code)
        self.assertEqual(1, len(User.objects.all()))
        self.assertEqual(1, len(Profile.objects.all()))

    def test_reject_non_image(self):
        pass

    def test_create_profile(self):
        # request
        response = self.client.post(self.url, self.data, format="multipart")
        response_json = json.loads(response.content)
        profile_data = response_json["profile"]
        user_data = response_json["user"]

        # check response
        self.assertEqual(200, response.status_code)
        self.assertSetEqual(
            set(["id", "user_id", "profile_img"]), set(profile_data.keys())
        )
        self.assertDictEqual(
            {"username": self.data["username"], "email": self.data["email"]}, user_data
        )

        # check data
        self.assertEqual(2, len(User.objects.all()))
        self.assertEqual(2, len(Profile.objects.all()))
        self.assertEqual(
            1,
            len(
                User.objects.filter(
                    username=self.data["username"], email=self.data["email"]
                )
            ),
        )

        user = User.objects.get(
            username=self.data["username"], email=self.data["email"]
        )
        self.assertEqual(1, len(Profile.objects.filter(user=user)))


class TestProfileListGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # users/profiles
        self.profiles = []
        for i in range(10):
            username = f"user{i}"
            password = f"j;kalf{i}"
            email = f"user{i}@email.com"

            user = User(username=username, email=email)
            user.set_password(password)
            user.save()

            profile = Profile.objects.create(user_id=user.pk)

            self.profiles.append(
                {
                    "profile": {
                        "id": profile.pk,
                        "user_id": user.pk,
                        "profile_img": None,
                    },
                    "user": {"username": user.username},
                }
            )

        for i in range(10):
            username = f"specialuser{i}"
            password = f"j;kalf{i}"
            email = f"user{i}@email.com"

            user = User(username=username, email=email)
            user.set_password(password)
            user.save()

            profile = Profile.objects.create(user_id=user.pk)

            self.profiles.append(
                {
                    "profile": {
                        "id": profile.pk,
                        "user_id": user.pk,
                        "profile_img": None,
                    },
                    "user": {"username": user.username},
                }
            )

        self.all_url = "/profiles/"
        self.page_url = "/profiles/?page=2"
        self.search_url = "/profiles/?search=special"

    def test_get_page(self):
        response = self.client.get(self.page_url)
        response_json = json.loads(response.content)
        profile_list = response_json["profiles"]
        num_pages = response_json["num_pages"]

        self.assertEqual(200, response.status_code)
        self.assertEqual(10, len(profile_list))
        self.assertEqual(2, num_pages)

        expected_profiles = self.profiles[-10:]

        self.assertListEqual(expected_profiles, profile_list)

    def test_get_search(self):
        response = self.client.get(self.search_url)
        response_json = json.loads(response.content)
        profile_list = response_json["profiles"]
        num_pages = response_json["num_pages"]

        self.assertEqual(200, response.status_code)
        self.assertEqual(10, len(profile_list))
        self.assertEqual(1, num_pages)

        expected_profiles = [
            profile
            for profile in self.profiles
            if "special" in profile["user"]["username"]
        ]

        self.assertListEqual(expected_profiles, profile_list)

    def test_get_all(self):
        response = self.client.get(self.all_url)
        response_json = json.loads(response.content)
        profile_list = response_json["profiles"]
        num_pages = response_json["num_pages"]

        self.assertEqual(200, response.status_code)
        self.assertEqual(10, len(profile_list))
        self.assertEqual(2, num_pages)

        self.assertListEqual(self.profiles[:10], profile_list)


class TestFollowDetailPOST(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # user
        self.username = "user1"
        self.password = "user1pass"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()

        profile = Profile.objects.create(user=user)

        self.profile_id = profile.pk

        # other user
        user = User.objects.create(username="user2", password="user2pass")
        profile = Profile.objects.create(user=user)

        self.other_profile_id = profile.pk

        # url
        self.good_url = f"/profiles/profile/{self.other_profile_id}/follow/"
        self.no_profile_url = (
            f"/profiles/profile/{self.other_profile_id + self.profile_id}/follow/"
        )

    def test_reject_no_user(self):
        response = self.client.post(self.good_url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, len(Follow.objects.all()))

    def test_reject_profile_not_found(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.no_profile_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(0, len(Follow.objects.all()))

    def test_reject_duplicate(self):
        # make follow
        Follow.objects.create(
            follower_id=self.profile_id,
            following_id=self.other_profile_id,
            date_created=timezone.now(),
        )

        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.good_url)

        self.assertEqual(409, response.status_code)
        self.assertEqual(1, len(Follow.objects.all()))

    def test_create_follow(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.post(self.good_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)

        self.assertTrue(
            Follow.objects.filter(
                follower_id=self.profile_id, following_id=self.other_profile_id
            ).exists()
        )
        follow = Follow.objects.get(
            follower_id=self.profile_id, following_id=self.other_profile_id
        )

        self.assertDictEqual(
            {
                "id": follow.pk,
                "follower_id": self.profile_id,
                "following_id": self.other_profile_id,
            },
            response_json,
        )
        self.assertEqual(1, len(Follow.objects.all()))


class TestFollowDetailDELETE(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # user
        self.username = "user1"
        self.password = "user1pass"
        user = User(username=self.username)
        user.set_password(self.password)
        user.save()

        profile = Profile.objects.create(user=user)

        self.profile_id = profile.pk

        # user 2
        self.other_username = "user2"
        self.other_password = "user2pass"
        user = User(username=self.other_username)
        user.set_password(self.other_password)
        user.save()

        profile = Profile.objects.create(user=user)

        self.other_profile_id = profile.pk

        # user 3
        user = User.objects.create(username="user3", password="user3pass")
        profile = Profile.objects.create(user=user)
        profile_3_id = profile.pk

        # urls
        self.good_url = f"/profiles/profile/{self.other_profile_id}/follow/"
        self.no_profile_url = f"/profiles/profile/{profile_3_id + self.other_profile_id + self.profile_id}/follow/"
        self.no_follow_url = f"profiles/profile/{profile_3_id}/follow"

        # create follow
        Follow.objects.create(
            follower_id=self.profile_id,
            following_id=self.other_profile_id,
            date_created=timezone.now(),
        )

    def test_reject_no_user(self):
        response = self.client.delete(self.good_url)

        self.assertEqual(403, response.status_code)
        self.assertEqual(1, len(Follow.objects.all()))

    def test_reject_profile_not_found(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.no_profile_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(Follow.objects.all()))

    def test_reject_follow_not_found(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.no_follow_url)

        self.assertEqual(404, response.status_code)
        self.assertEqual(1, len(Follow.objects.all()))

    def test_delete_follow(self):
        # login
        self.client.login(username=self.username, password=self.password)

        # request
        response = self.client.delete(self.good_url)
        response_json = json.loads(response.content)

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(Follow.objects.all()))
        self.assertDictContainsSubset(
            {"following_id": self.other_profile_id, "follower_id": self.profile_id},
            response_json,
        )


class TestFollowListGET(APITestCase):
    def setUp(self):
        # client
        self.client = APIClient()

        # create users/profiles
        profile_ids = []

        for i in range(10):
            user = User.objects.create(username=f"user{i}", password=f"userpass{i}")
            profile = Profile.objects.create(user=user)

            profile_ids.append(profile.pk)

        # create follow relationships
        # profile[0] will follow everyone, everyone will follow profile[0]
        self.follow_data = []
        for i in range(1, len(profile_ids)):
            # profile 0 follows profile i
            follow1 = Follow.objects.create(
                follower_id=profile_ids[0],
                following_id=profile_ids[i],
                date_created=timezone.now(),
            )
            self.follow_data.append(
                {
                    "id": follow1.pk,
                    "follower_id": follow1.follower.pk,
                    "following_id": follow1.following.pk,
                }
            )

            # profile i follows profile 0
            follow2 = Follow.objects.create(
                following_id=profile_ids[0],
                follower_id=profile_ids[i],
                date_created=timezone.now(),
            )
            self.follow_data.append(
                {
                    "id": follow2.pk,
                    "follower_id": follow2.follower.pk,
                    "following_id": follow2.following.pk,
                }
            )

        # urls
        self.all_url = "/profiles/follows/"
        self.following_url = f"/profiles/follows/?following={profile_ids[0]}"
        self.follower_url = f"/profiles/follows/?follower={profile_ids[0]}"

        self.example_id = profile_ids[0]

    def test_get_following(self):
        response = self.client.get(self.following_url)
        response_json = json.loads(response.content)
        follow_list = response_json["follows"]

        self.assertEqual(200, response.status_code)

        expected_follows = [
            follow
            for follow in self.follow_data
            if follow["following_id"] == self.example_id
        ]

        self.assertListEqual(expected_follows, follow_list)

    def test_get_follower(self):
        response = self.client.get(self.follower_url)
        response_json = json.loads(response.content)
        follow_list = response_json["follows"]

        self.assertEqual(200, response.status_code)

        expected_follows = [
            follow
            for follow in self.follow_data
            if follow["follower_id"] == self.example_id
        ]

        self.assertListEqual(expected_follows, follow_list)

    def test_get_all(self):
        response = self.client.get(self.all_url)
        response_json = json.loads(response.content)
        follow_list = response_json["follows"]

        self.assertEqual(200, response.status_code)
        self.assertListEqual(self.follow_data, follow_list)

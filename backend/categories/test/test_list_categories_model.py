# from django rest framework
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
# test - utils
from testing_utilities.utils import generate_categories
# json
import json


class CategoriesListViewTests(APITestCase):
    """
    Test cases for CategoriesListView.
    """

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('categories-list')

    def test_list_categories_success(self):
        generate_categories(self)

        response = self.client.get(self.url)

        response_data = json.loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_data), 4)
        self.assertEqual(response_data[0]['name'], 'public')
        self.assertEqual(response_data[1]['name'], 'authenticated')
        self.assertEqual(response_data[2]['name'], 'team')
        self.assertEqual(response_data[3]['name'], 'author')

    def test_list_categories_empty_success(self):
        response = self.client.get(self.url)

        response_data = json.loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_data), 0)

# from django rest framework
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
# test - utils
from testing_utilities.utils import generate_permissions
# json
import json


class PermissionLevelsListViewTests(APITestCase):
    """
    Test cases for PermissionLevelsListView.
    """

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('permissions-list')

    def test_list_permission_levels_success(self):
        
        generate_permissions(self)
        response = self.client.get(self.url)

        response_data = json.loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_data), 3)
        self.assertEqual(response_data[0]['permission_level'],'none')
        self.assertEqual(response_data[1]['permission_level'],'read-only')
        self.assertEqual(response_data[2]['permission_level'],'read-and-edit')

    def test_list_categories_empty_success(self):
        response = self.client.get(self.url)

        response_data = json.loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_data), 0)

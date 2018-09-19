import json
import os

import requests

from flaskr.constants import BDX_BIKE_PARKS_JSON_URL, BDX_BIKE_PARKS_FILEPATH


class BordeauxCollection(object):
    @staticmethod
    def download_json_file(file_url):
        print('downloading JSON file', file_url)
        response = requests.get(file_url)
        assert response.ok
        return response.json()

    @staticmethod
    def save_json(json_data, output_filepath):
        print('saving JSON file', output_filepath)
        with open(output_filepath, 'w') as json_file:
            json.dump(json_data, json_file)

    @staticmethod
    def load_json(json_filepath):
        print('loading JSON file', json_filepath)
        with open(json_filepath, 'r') as json_file:
            return json.load(json_file)

    @classmethod
    def get_json(cls):
        print('getting JSON file')
        if not os.path.exists(BDX_BIKE_PARKS_FILEPATH):
            json_data = cls.download_json_file(BDX_BIKE_PARKS_JSON_URL)
            cls.save_json(json_data, BDX_BIKE_PARKS_FILEPATH)
        return cls.load_json(BDX_BIKE_PARKS_FILEPATH)

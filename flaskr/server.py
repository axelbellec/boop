from flask import Flask, jsonify, render_template
from geojson import Point, Feature

from flaskr.collection import BordeauxCollection

app = Flask(__name__)
app.config.from_object('config')

MAPBOX_ACCESS_KEY = app.config.get('MAPBOX_ACCESS_TOKEN')


def create_bike_park_locations(bike_parks_json):
    bike_park_locations = []
    for feature in bike_parks_json:
        # Create a geojson object for park location
        lon = float(feature.get('x_long'))
        lat = float(feature.get('y_lat'))

        point = Point([lon, lat])

        marker_title = '<strong>{nature}</strong>'.format(**feature)
        if feature.get('nombre'):
            marker_title += '<p>(#{nombre})</p>'.format(**feature)

        properties = {
            'title': marker_title,
            'icon': 'circle'
        }

        feature = Feature(geometry=point, properties=properties)

        bike_park_locations.append(feature)

    return bike_park_locations


@app.route('/api/geojson')
def api_geojson():
    bike_parks_json = BordeauxCollection.get_json()['d']
    mapbox_park_locations = create_bike_park_locations(bike_parks_json)
    return jsonify(mapbox_park_locations), 200


@app.route('/')
@app.route('/mapbox_js')
def mapbox_js():
    bike_parks_json = BordeauxCollection.get_json()['d']
    mapbox_park_locations = create_bike_park_locations(bike_parks_json)
    return render_template(
        'mapbox_js.html',
        ACCESS_KEY=MAPBOX_ACCESS_KEY,
        mapbox_park_locations=mapbox_park_locations
    )

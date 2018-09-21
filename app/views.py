from flask import jsonify, render_template
from geojson import FeatureCollection, Feature, Point

from app import app
from app.collection import BordeauxCollection

MAPBOX_ACCESS_KEY = app.config.get('MAPBOX_ACCESS_TOKEN')


def create_bike_park_locations(bike_parks_json):

    bike_park_locations = []
    for feature in bike_parks_json:
        # Create a geojson object for park location
        hoop_long = float(feature.get('x_long'))
        hoop_lat = float(feature.get('y_lat'))
        hoop_nature = feature.get('nature')
        hoop_number = feature.get('nombre')
        hoop_type = feature.get('domanialite')
        hoop_owner = feature.get('proprietaire')

        point = Point([hoop_long, hoop_lat])

        marker_title = '<strong>{}</strong>'.format(hoop_nature)
        if hoop_number:
            marker_title += '<p>(#{})</p>'.format(hoop_number)
        if hoop_type:
            marker_title += '<p>{}</p>'.format(hoop_type)
        if hoop_owner:
            marker_title += '<p><i>{}</i></p>'.format(hoop_owner)

        properties = {
            'title': marker_title,
            'icon': 'circle'
        }

        feature = Feature(geometry=point, properties=properties)

        bike_park_locations.append(feature)

    return FeatureCollection(features=bike_park_locations)


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

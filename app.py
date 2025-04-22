from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

def get_noaa_data(station_id, product, date="Latest"):
    api_url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"

    params = {
        "station": station_id,
        "product": product,
        "date": date,
        "range": 1,
        "datum": "MLLW",
        "units": "metric",
        "format": "json",
        "time_zone": "lst_ldt"
    }

    if product == "predictions":
        params["interval"] = "h"
        params["date"] = "today"
        del params["range"]

    response = requests.get(api_url, params=params)
    print(f"Response status: {response.status_code}")
    print(f"Full URL: {response.url}")
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data from API"}, 500

@app.route('/api/water-level/<station_id>', methods=['GET'])
def get_water_level_route(station_id):
    return jsonify(get_noaa_data(station_id, "water_level"))

@app.route('/api/tide-prediction/<station_id>', methods=['GET'])
def get_tide_prediction_route(station_id):
    return jsonify(get_noaa_data(station_id, "predictions"))

@app.route('/api/water-temperature/<station_id>', methods=['GET'])
def get_water_temp_route(station_id):
    return jsonify(get_noaa_data(station_id, "water_temperature"))

@app.rout('/api/stations', methods=['GET'])
def get_station_list():
    response = requests.get("https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json")
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return {"error": "Failed to fetch station metadata"}, 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)
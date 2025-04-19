# from flask import Flask, request, jsonify
import requests
# import urllib.parse
# from flask_cors import CORS
import json
from datetime import datetime, timedelta

# print("Hello World!") 
# app = Flask(__name__)
# CORS(app)

# @app.route('/check', methods=['GET'])
def get_noaa_data(station_id, product):
    # url = request.args.get('url')

    # if not url:
    #     return jsonify({"error": "No URL provided"}), 400 
    # if begin_date is None:
    #     yesterday = datetime.now() - timedelta(days=1)
    #     begin_date = yesterday.strftime("%Y%m%d")
    # if end_date is None:
    #     today = datetime.now()
    #     end_date = today.strftime("%Y%m%d")

    # api_url = "https://api.tidesandcurrents.noaa.gov/api/prod/#DataAPIResponse"
    api_url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"

    params = {
        "station": station_id,
        "product": product,
        "date": "Latest",
        "range": 1,
        "datum": "MLLW",
        "units": "metric",
        "format": "json",
        "time_zone": "lst_ldt"
    }

    # print(f"Product: {product} Latest date: {} end_date: {end_date}")

    response = requests.get(api_url, params=params)
    print(f"Response status: {response.status_code}")
    print(f"Full URL: {response.url}")
    
    # try:
    #     response = requests.get(api_url)
    #     if response.status_code == 200:
    #         return jsonify(response.json())
    #     else:
    #         return jsonify({"error": "Failed to fetch data from API"}), 500
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500 
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data from API"}, 500

if __name__ == '__main__':
    station_id = '9414290'

    water_data = get_noaa_data(station_id, "water_level")
    print(json.dumps(water_data, indent=2))

    tide_predictions = get_noaa_data(station_id, "predictions")
    print(json.dumps(tide_predictions, indent=2))

    temperature_data = get_noaa_data(station_id, "water_temperature")
    print(json.dumps(temperature_data, indent=2))
    # app.run(debug=True)

# response = requests.get(f"")

# print(response.text)
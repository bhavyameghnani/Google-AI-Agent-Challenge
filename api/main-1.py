from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__)
# Allow cross-origin requests from the React development server
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_dashboard_data():
    """
    Serves the dashboard data from the Data/data.json file.
    """
    try:
        data_path = os.path.join(app.root_path, 'Data', 'data.json')
        with open(data_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Data file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ensure the Data directory exists
    if not os.path.exists('Data'):
        os.makedirs('Data')
    # Run the Flask app on a different port to avoid conflicts with React
    app.run(port=5005, debug=True)

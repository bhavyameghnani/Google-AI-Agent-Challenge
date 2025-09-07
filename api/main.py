from flask import Flask, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(app.root_path, 'Data')

@app.route('/api/data', methods=['GET'])
def get_all_data():
    """
    Fetch all JSON files from the Data folder and return them as a dictionary.
    Each key will be the file name (unique ID) and the value will be the JSON content.
    """
    try:
        all_data = {}
        for filename in os.listdir(DATA_DIR):
            if filename.endswith('.json'):
                file_id = filename[:-5]  # remove .json
                file_path = os.path.join(DATA_DIR, filename)
                with open(file_path, 'r') as f:
                    all_data[file_id] = json.load(f)
        return jsonify(all_data)
    except FileNotFoundError:
        return jsonify({"error": "Data directory not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/ids', methods=['GET'])
def get_ids():
    """
    Return a list of all JSON file names (without .json) in the Data folder.
    Example response: ["SarvamAI", "LumaAI", ...]
    """
    try:
        ids = [filename[:-5] for filename in os.listdir(DATA_DIR) if filename.endswith('.json')]
        return jsonify(ids)
    except FileNotFoundError:
        return jsonify({"error": "Data directory not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/data/<string:file_id>', methods=['GET'])
def get_data_by_id(file_id):
    """
    Fetch a single JSON file by its ID (file name without extension).
    """
    try:
        file_path = os.path.join(DATA_DIR, f"{file_id}.json")
        if not os.path.exists(file_path):
            return jsonify({"error": "Data file not found"}), 404
        with open(file_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    app.run(port=5005, debug=True)

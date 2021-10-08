#!flask/bin/python
from flask import Flask, jsonify
from GarageController import GarageController
import yaml

CONFIG = {}

with open('./config.yaml') as file:
    CONFIG = yaml.load(file, Loader=yaml.FullLoader)

app = Flask(__name__)

gc = GarageController()


@app.route("/toggle-garage-door", methods=["GET"])
def toggleGarageDoor():
    gc.toggleGarageDoor()
    return jsonify({"doorStatus": gc.getGarageState()})


@app.route("/garage-door-status", methods=["GET"])
def getGarageState():
    return jsonify({"doorStatus": gc.getGarageState()})


if __name__ == "__main__":
    app.run(host=CONFIG['IPCONFIG'], port=CONFIG['PORT'], debug=CONFIG['DEBUGGER'], use_reloader=CONFIG['RELOADER'])


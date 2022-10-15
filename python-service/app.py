#!flask/bin/python

# Replace libraries by fake ones
try:
    import RPi.GPIO as GPIO
except ImportError:
    print('no local gpio found, defaulting to fake gpio.')
    import sys
    import fake_rpi
    sys.modules['RPi'] = fake_rpi.RPi     # Fake RPi
    sys.modules['RPi.GPIO'] = fake_rpi.RPi.GPIO # Fake GPIO
    sys.modules['smbus'] = fake_rpi.smbus # Fake smbus (I2C)
    

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


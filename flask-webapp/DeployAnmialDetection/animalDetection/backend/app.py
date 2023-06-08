from distutils.log import debug
from fileinput import filename
from werkzeug.utils import secure_filename
from flask import *
from ML import predict
import pandas as pd
import os
from pathlib import Path
from flask import jsonify, request

app = Flask(__name__)

BASEDIR = os.getcwd()
BACKENDDIR = os.path.join(BASEDIR,"animalDetection/backend")
IMAGEDIR = os.path.join(BACKENDDIR,"images")

app.config["IMAGE_UPLOADS"] = IMAGEDIR
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPG", "JPEG"]
  
@app.route('/uploadImages', methods = ['POST'])  
def uploadImages():
    file = request.files.get('image')
    if file:
        mimetype = file.content_type
        filename = secure_filename(file.filename)
        if not allowed_image(filename):
            return jsonify({

                'success' : False,
                'note' : 'not allow file type'
            })
        file.save(os.path.join(app.config["IMAGE_UPLOADS"], filename))
        return jsonify({
            'success': True,
            'note': 'file received',
            'type' : mimetype
        })
    return jsonify({
        'success' : False,
        'note' : 'file not recieved'
    })

@app.route('/clearImages', methods = ['GET'])
def clearImages():
    for file in os.listdir(app.config["IMAGE_UPLOADS"]):
        os.remove(os.path.join(app.config["IMAGE_UPLOADS"], file))
    if len(os.listdir(app.config["IMAGE_UPLOADS"]))==0:
        return jsonify({
            'success': True,
            'note': 'all images removed',
        })
    else:
        return jsonify({
            'success': False,
            'note': 'fail to remove all images',
        })


def allowed_image(filename):
    if not "." in filename:
        return False
    #looks for first. to find file ext, make sure this is the case later
    ext = filename.rsplit(".", 1)[1]

    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False
    
@app.route('/yolov8Predict', method=['GET'])
def yolov8Predict():
    
    

if __name__ == '__main__':  
    app.run(debug=True)
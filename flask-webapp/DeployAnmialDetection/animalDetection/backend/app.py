from distutils.log import debug
from fileinput import filename
from werkzeug.utils import secure_filename
from flask import *
from ML import (
    YoloPredict, 
    ViTPredict, 
    Resnet_predict, 
    initalize_yolov8,
    intialize_resnet,
    initialize_vit
)
import pandas as pd
import os
import json
from PIL import Image
from pathlib import Path
from flask import jsonify, request

app = Flask(__name__)

BASEDIR = os.getcwd()
BACKENDDIR = os.path.join(BASEDIR,"animalDetection/backend")
STATSDIR = os.path.join(BACKENDDIR,"stats")
IMAGEDIR = os.path.join(BACKENDDIR,"images")
ANIMALDIR = os.path.join(BACKENDDIR,"animals")
DOWNLOADDIR = os.path.join(BASEDIR, "output")

app.config["IMAGE_UPLOADS"] = IMAGEDIR
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPG", "JPEG"]

yolov8Model = None
resnetModel = None
vitModel = None

initalized = False
  
@app.route('/uploadImages', methods = ['POST'])  
def uploadImages():
    if not os.path.exists(IMAGEDIR):
        os.makedirs(IMAGEDIR)
    if not os.path.exists(STATSDIR):
        os.makedirs(STATSDIR)
    if not os.path.exists(ANIMALDIR):
        os.makedirs(ANIMALDIR)
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
    
@app.route('/yolov8Predict', methods = ['GET'])
def yolov8Predict():
    dict = {}
    yolov8Model = initalize_yolov8()
    for image in os.listdir(app.config["IMAGE_UPLOADS"]):
        filename = image
        image = Image.open(os.path.join(IMAGEDIR,image))
        yolo_res = YoloPredict(yolov8Model,image, 0.25)
        if yolo_res[4]!=0:
            dict[filename] = {
                'detected' : 1,
                'yolo_res' : yolo_res
            }
        else:
            dict[filename] = {
                'detected' : 0,
                'yolo_res' : yolo_res
            }
        image.close()

    with open (os.path.join(STATSDIR,'image_data.json'), 'w') as file:
        json.dump(dict, file)
    return jsonify(dict)

@app.route('/resnetPredict', methods = ['GET'])
def resnetPredict():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    resnetModel = intialize_resnet()
    for key, value in image_data.items():
        if value['detected'] == 1:
            filename = str(key)
            image = Image.open(os.path.join(IMAGEDIR,filename))
            image = image.convert('RGB')
            resnet_res = Resnet_predict(resnetModel,image,0.25)
            image_data[filename]['resnet_res'] = resnet_res
            image.close()
    with open (os.path.join(STATSDIR,'image_data.json'), 'w') as file:
        json.dump(image_data, file)
    return jsonify(image_data)

@app.route('/vitPredict', methods = ['GET'])
def vitPredict():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    vitModel = initialize_vit()
    for key, value in image_data.items():
        if value['detected'] == 1:
            filename = str(key)
            image = Image.open(os.path.join(IMAGEDIR,filename))
            image = image.convert('RGB')
            vit_res = ViTPredict(vitModel,image,0.25)
            image_data[filename]['vit_res'] = vit_res
            image.close()
    with open (os.path.join(STATSDIR,'image_data.json'), 'w') as file:
        json.dump(image_data, file)
    return jsonify(image_data)

@app.route('/download', methods = ['GET'])
def download():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    if not os.path.exists(DOWNLOADDIR):
        os.makedirs(DOWNLOADDIR)
    with open (os.path.join(DOWNLOADDIR, "image_data.json"), "w") as file:
        json.dump(image_data, file, indent=4)
    return jsonify(image_data)

if __name__ == '__main__':  
    app.run(debug=True)
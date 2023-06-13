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
import shutil
import plotly
import plotly.express as px

app = Flask(__name__)

BASEDIR = os.getcwd()
BACKENDDIR = os.path.join(BASEDIR,"animalDetection/backend")
STATSDIR = os.path.join(BACKENDDIR,"stats")
IMAGEDIR = os.path.join(BACKENDDIR,"images")
DOWNLOADDIR = os.path.join(BASEDIR, "output")
NOANIMALDIR = os.path.join(DOWNLOADDIR,"no_animals")
ANIMALDIR = os.path.join(DOWNLOADDIR,"animals")
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
    count = 0
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
            count += 1
        else:
            dict[filename] = {
                'detected' : 0,
                'yolo_res' : yolo_res
            }
        image.close()

    with open (os.path.join(STATSDIR,'image_data.json'), 'w') as file:
        json.dump(dict, file)
    return jsonify({"detected":count, "total": len(dict), "image_data":dict})

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
    d = {"image_name":[],"animal_detected":[], "yolov8_result":[], "resnet_label":[],"resnet_result":[], "vit_result":[]}
    for key, value in image_data.items():
        d["image_name"].append(str(key))
        d["animal_detected"].append(value["detected"])
        d["yolov8_result"].append(value["yolo_res"])
        if "vit_res" in value:
            d["vit_result"].append(value["vit_res"])
        else:
            d["vit_result"].append("N/A")
        if "resnet_res" in value:
            d['resnet_label'].append(value['resnet_res'][2])
            d["resnet_result"].append(value['resnet_res'])
        else:
            d['resnet_label'].append("N/A")
            d["resnet_result"].append("N/A")
    df = pd.DataFrame(data=d)
    if not os.path.exists(DOWNLOADDIR):
        os.makedirs(DOWNLOADDIR)
    # with open (os.path.join(DOWNLOADDIR, "image_data.json"), "w") as file:
    #     json.dump(image_data, file, indent=4)
    df.to_csv(os.path.join(DOWNLOADDIR, "image_data.csv"))
    return jsonify(image_data)

@app.route('/sortImages', methods = ['GET'])
def sort():
    if os.path.exists(NOANIMALDIR):
        shutil.rmtree(NOANIMALDIR)
    os.makedirs(NOANIMALDIR)
    if os.path.exists(ANIMALDIR):
        shutil.rmtree(ANIMALDIR)
    os.makedirs(ANIMALDIR)
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    for key, value in image_data.items():
        if value["detected"]==0:
            shutil.copy2(os.path.join(IMAGEDIR,str(key)), NOANIMALDIR)
        else:
            shutil.copy2(os.path.join(IMAGEDIR,str(key)), ANIMALDIR)
    return jsonify({"result":f"finished sorting {len(image_data)}"})

@app.route('/graph', methods = ['GET'])
def graph():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    count = 0
    for key, value in image_data.items():
        if value["detected"]==0:
            shutil.copy2(os.path.join(IMAGEDIR,str(key)), NOANIMALDIR)
        else:
            count += 1
            shutil.copy2(os.path.join(IMAGEDIR,str(key)), ANIMALDIR)
    res = {}
    not_detected = len(image_data)-count
    df = pd.DataFrame({
        "values": [count,not_detected],
        "labels": ["detected_animals", "no_animals"],
    })
    fig = px.pie(df, values="values",labels="labels")
    graphJSON = plotly.io.to_json(fig, pretty=True)
    return graphJSON

if __name__ == '__main__':  
    app.run(debug=True)
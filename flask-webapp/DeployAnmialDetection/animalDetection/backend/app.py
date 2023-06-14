from distutils.log import debug
from fileinput import filename
import sys
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
from PIL import Image, TiffImagePlugin
from PIL.ExifTags import TAGS
from flask import jsonify, request
import shutil
import plotly
import plotly.express as px
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASEDIR = os.getcwd()
BACKENDDIR = os.path.join(BASEDIR,"animalDetection/backend")
STATSDIR = os.path.join(BACKENDDIR,"stats")
IMAGEDIR = os.path.join(BACKENDDIR,"images")
DOWNLOADDIR = os.path.join(BASEDIR, "output")
WEIGHTDIR = os.path.join(BACKENDDIR, "weights")
NOANIMALDIR = os.path.join(DOWNLOADDIR,"no_animals")
ANIMALDIR = os.path.join(DOWNLOADDIR,"animals")
TEMPDIR = os.path.join(BACKENDDIR,"temp")
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
    
@app.route('/yolov8Predict', methods = ['POST'])
def yolov8Predict():
    dict = {}
    count = 0
    jsondata = request.get_json()
    conf = float(jsondata.get("conf"))
    yolov8Model = initalize_yolov8()
    for image in os.listdir(app.config["IMAGE_UPLOADS"]):
        filename = image
        image = Image.open(os.path.join(IMAGEDIR,image))
        exifdata = image.getexif()
        metadata = {}
        for tag_id in exifdata:
            tag = TAGS.get(tag_id, tag_id)
            data = exifdata.get(tag_id)
            if isinstance(data, bytes):
                data = data.decode()
            if not isinstance(data, TiffImagePlugin.IFDRational):
                metadata[str(tag)] = data
        yolo_res = YoloPredict(yolov8Model,image, conf)
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
        dict[filename]["metadata"] = metadata
        dict[filename]["yolov8_conf"] = conf
        image.close()

    with open (os.path.join(STATSDIR,'image_data.json'), 'w') as file:
        json.dump(dict, file)
    return jsonify({"detected":count, "total": len(dict), "image_data":dict})

@app.route('/resnetPredict', methods = ["POST"])
def resnetPredict():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    weightInUse = "resnet.pth"

    data = request.get_json()
    weightInUse = data.get('name')
    conf = float(data.get('conf'))
    if weightInUse == "resnet.pth":
        resnetModel = intialize_resnet(None)
    else:
        resnetModel = intialize_resnet(os.path.join(TEMPDIR, weightInUse))

    resnetModel = intialize_resnet(None)
    for key, value in image_data.items():
        if value['detected'] == 1:
            filename = str(key)
            image = Image.open(os.path.join(IMAGEDIR,filename))
            image = image.convert('RGB')
            resnet_res = Resnet_predict(resnetModel,image,conf)
            image_data[filename]['resnet_res'] = {"confident" : resnet_res[1]}
            if len(resnet_res) > 2:
                image_data[filename]['resnet_res']["label"] = resnet_res[2]
            else:
                image_data[filename]['resnet_res']["label"] = 0
            image_data[filename]['resnet_res']["resnet_weight_filename"] = weightInUse
            image_data[filename]['resnet_res']["resnet_conf"] = conf
            image.close()
    with open (os.path.join(STATSDIR,'image_data.json'), 'w') as file:
        json.dump(image_data, file)
    return jsonify(image_data)

@app.route('/vitPredict', methods = ['POST'])
def vitPredict():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    jsondata = request.get_json()
    conf = float(jsondata.get("conf"))
    vitModel = initialize_vit()
    for key, value in image_data.items():
        if value['detected'] == 1:
            filename = str(key)
            image = Image.open(os.path.join(IMAGEDIR,filename))
            image = image.convert('RGB')
            vit_res = ViTPredict(vitModel,image,conf)
            image_data[filename]['vit_res'] = vit_res
            image_data[filename]['vit_conf'] = conf
            image.close()
    with open (os.path.join(STATSDIR,'image_data.json'), 'w') as file:
        json.dump(image_data, file)
    return jsonify(image_data)

@app.route('/download', methods = ['GET'])
def download():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    d = {"image_name":[],"animal_detected":[], "yolov8_result":[], "yolov8_conf":[], "resnet_label":[],"resnet_confident":[], "resnet_weight_filename":[], "resnet_conf":[],"vit_result":[],"vit_conf":[], "metadata":[]}
    for key, value in image_data.items():
        d["image_name"].append(str(key))
        d["metadata"].append(value['metadata'])
        d["animal_detected"].append(value["detected"])
        d["yolov8_result"].append(value["yolo_res"])
        d["yolov8_conf"].append(value["yolov8_conf"])
        if "vit_res" in value:
            d["vit_result"].append(value["vit_res"])
            d["vit_conf"].append(value["vit_conf"])
        else:
            d["vit_result"].append("N/A")
            d["vit_conf"].append("N/A")
        if "resnet_res" in value:
            d['resnet_label'].append(value['resnet_res']['label'])
            d["resnet_confident"].append(value['resnet_res']['confident'])
            d["resnet_weight_filename"].append(value['resnet_res']["resnet_weight_filename"])
            d['resnet_conf'].append(value['resnet_res']["resnet_conf"])
        else:
            d['resnet_label'].append("N/A")
            d["resnet_confident"].append("N/A")
            d["resnet_weight_filename"].append("N/A")
            d['resnet_conf'].append("N/A")
    df = pd.DataFrame(data=d)
    if not os.path.exists(DOWNLOADDIR):
        os.makedirs(DOWNLOADDIR)
    # with open (os.path.join(DOWNLOADDIR, "image_data.json"), "w") as file:
    #     json.dump(image_data, file, indent=4)
    if os.path.isfile(os.path.join(DOWNLOADDIR, "image_data.csv")):
        os.remove(os.path.join(DOWNLOADDIR, "image_data.csv"))
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

@app.route('/graphPie', methods = ['GET'])
def graphPie():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    count = 0
    for value in image_data.values():
        if value["detected"]==1:
            count += 1
    not_detected = len(image_data)-count
    df = pd.DataFrame({
        "count": [count,not_detected],
        "image type": ["detected_animals", "no_animals"],
    })
    fig = px.pie(df, values="count",names="image type")
    graphJSON = plotly.io.to_json(fig, pretty=True)
    return graphJSON

@app.route('/ifHasMetadata', methods = ['GET'])
def ifhasMetadata():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    for _, data in image_data.items():
        if len(dict(data['metadata'])) == 0:
            return jsonify({"result": "false"})
        elif "DateTime" not in data['metadata']:
            return jsonify({"result": "false"})
    return jsonify({"result": "true"})

@app.route('/ifHasResnetData', methods = ['GET'])
def ifHasResnetData():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    for _, data in image_data.items():
        if "resnet_res" in data:
            return jsonify({"result": "true"})
    return jsonify({"result": "false"})
    

@app.route('/ifResnetWeightWorks', methods = ['POST'])
def ifResnetWeightWorks():
    file = request.files.get('fileToUpload')
    if file:
        filename = secure_filename(file.filename)
        if filename == "resnet.pth":
            filename = f"0{str(filename)}"
        try:
            count = 0
            weightname = filename
            if not os.path.exists(TEMPDIR):
                os.mkdir(TEMPDIR)
            while os.path.isfile(os.path.join(TEMPDIR, weightname)):
                weightname = f"{count}{str(filename)}"
                count += 1
            file.save(os.path.join(TEMPDIR, weightname))
            model = intialize_resnet(os.path.join(TEMPDIR, weightname))
        except:
            if os.path.isfile(os.path.join(TEMPDIR, weightname)):
                os.rmove(os.path.join(TEMPDIR, weightname))
            return jsonify({"result": "resnet.pth"})
        finally:
            return jsonify({"result": weightname})
    return jsonify({"result": "resnet.pth"})

@app.route('/graphTime', methods = ['GET'])
def graphTime():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    counter = {"05_12":0,"13_20":0,"21_04":0}
    for value in image_data.values():
        timestamp = str(value['metadata']['DateTime'])
        timestamp = timestamp.split(" ")[1]
        print(f'timestamp: {timestamp}\n', file=sys.stderr)
        hour = int(timestamp.split(":")[0])
        print(f'hour: {hour}\n', file=sys.stderr)
        if hour >=5 and hour<13:
            counter["05_12"] += 1
        if hour >=13 and hour < 21:
            counter["13_20"] += 1
        if hour >=21 and hour < 5:
            counter["21_04"] += 1
    values = []
    labels = []
    for range, count in counter.items():
        labels.append(range)
        values.append(count)

    df = pd.DataFrame({
        "count": values,
        "time range": labels,
    })
    fig = px.pie(df, values="count",names="time range")
    graphJSON = plotly.io.to_json(fig, pretty=True)
    return graphJSON

@app.route('/graphResnetClass', methods = ['GET'])
def graphResnetClass():
    with open (os.path.join(STATSDIR,'image_data.json'), 'r') as file:
        image_data = json.load(file)
    counter = {}
    for value in image_data.values():
        if "resnet_res" in value:
            label = str(value['resnet_res']['label'])
            if label == '0':
                label = "no classification"
            else:
                print(label, file=sys.stderr)
                label = label.split("'")[1]
                print(label, file=sys.stderr)
            if label in counter:
                counter[label] += 1
            else:
                counter[label] = 1
    values = []
    labels = []
    for label, count in counter.items():
        labels.append(label)
        values.append(count)

    df = pd.DataFrame({
        "count": values,
        "label": labels,
    })
    fig = px.bar(df, y="count", x="label", title="Resnet Classification Population")
    graphJSON = plotly.io.to_json(fig, pretty=True)
    return graphJSON


if __name__ == '__main__':  
    app.run(debug=True)
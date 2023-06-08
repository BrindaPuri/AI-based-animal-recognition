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

app.config["IMAGE_UPLOADS"] = os.path.join(BASEDIR,"animalDetection/backend/images")
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPG", "JPEG"]
  
@app.route('/uploadImages', methods = ['POST'])  
def uploadImages():
    # if request.method == 'POST':
    #     filename = ''
    #     data = request.get_json()
    #     print(data)
    #     image = request.form.get('image')
    #     filename = secure_filename(image.filename)
    #     image.save(Path(app.config["IMAGE_UPLOADS"] / image.filename))
    #     return jsonify({'uploaded': 'yes'})
    # else:
    #     return jsonify({'uploaded' : 'no'})
    file = request.files.get('image')
    if file:
        mimetype = file.content_type
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["IMAGE_UPLOADS"], filename))
        return jsonify({
            'success': True,
            'file': 'Received',
            'type' : mimetype
        })
    return jsonify({
        'success' : False
    })

# def uploadImages(): 
#         if request.form:
#             images = request.form.getlist("images")
#             for image in images:
#                 if image.filename == "":
#                     return jsonify({'uploaded': 'Image needs a name'})
                    
#                 if not allowed_image(image.filename):
#                     return jsonify({'uploaded': 'Image type not allow'})
#                 else:
#                     filename = secure_filename(image.filename)
#                     image.save(os.path.join(app.config["IMAGE_UPLOADS"], image.filename))
#                     print("Image Saved!")
#             predict(images)
#         return jsonify({'uploaded': 'yes'})
#     return jsonify({'uploaded': 'nothing'})


def allowed_image(filename):
    if not "." in filename:
        return False
    #looks for first. to find file ext, make sure this is the case later
    ext = filename.rsplit(".", 1)[1]

    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False

def redirect(url):
    return render_template(url)

if __name__ == '__main__':  
    app.run(debug=True)
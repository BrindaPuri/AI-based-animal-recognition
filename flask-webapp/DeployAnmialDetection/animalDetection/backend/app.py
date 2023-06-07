from distutils.log import debug
from fileinput import filename
from werkzeug.utils import secure_filename
from flask import *
from ML import predict
import pandas as pd
import os

app = Flask(__name__)  
  

app.config["IMAGE_UPLOADS"] = "/Users/shubanranganath/Desktop/HM/images"
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["PNG", "JPG", "JPEG"]

@app.route('/')  
def main():  
    return render_template("index.html")  
  
@app.route('/success', methods = ['POST'])  
def success(): 
    if request.method == 'POST':
        if request.files:  
            images = request.files.getlist("file")
            for image in images:
                if image.filename == "":
                    print("Image needs a name")
                    return redirect("bad_file.html")
                    
                if not allowed_image(image.filename):
                    print("Image type not allowed")
                    return redirect("bad_file.html") 
                else:
                    filename = secure_filename(image.filename)
                    image.save(os.path.join(app.config["IMAGE_UPLOADS"], image.filename))
                    print("Image Saved!")
            predict(images)
        return render_template("Acknowledgement.html")


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
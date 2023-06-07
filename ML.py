
from ultralytics import YOLO
from transformers import ResNetModel

from pytorch_pretrained_vit import ViT
import pandas as pd

def predict(images):
    print("starting prediction")
    yolo = YOLO('weights/yolov8.pt')
    resnet =  ResNetModel.from_pretrained('weights/resnet.pth')
    resnet.eval()
    #vit = ViT('B_16_imagenet1k', pretrained=True)
    df = pd.DataFrame(columns= ['Image','x1','y1','x2','y2','Yolo_Conf','Resnet_conf','Resnet_label','ViT_label', ] )
    for image in images:
        print(image.filename)
        yolo_res = YoloPredict(yolo,image,0.25)
        if not yolo_res == 0:
            resnet_res = Resnet_predict(resnet, image)
            
            new_row = {'Image':image.filename,'x1':yolo_res[0],'y1':yolo_res[1],
                       'x2':yolo_res[2],'y2':yolo_res[3],'Yolo_Conf':yolo_res[4], 'Resnet_conf':resnet_res[2]}
            df = df.append(new_row, ignore_index=True)

def Resnet_predict(model, image):
     return model(image)


def YoloPredict(model, image, conf_low):
    result = model.predict(source="/Users/shubanranganath/Desktop/HM/images/"+image.filename, save=False, show=False, save_txt=False, conf=conf_low)
    if result[0].probs == None:
            return 0
    return result[0].boxes.boxes



from ultralytics import YOLO
from transformers import ResNetModel
import numpy as np
from torchvision import transforms
import torch
from pytorch_pretrained_vit import ViT
import pandas as pd
from PIL import Image
import torchvision

def predict(images):
    print("starting prediction")
    yolo = YOLO('weights/yolov8.pt')
    resnet = torchvision.models.resnet50(weights=True)

    df = pd.DataFrame(columns= ['Image','x1','y1','x2','y2','Yolo_Conf','Resnet_conf','Resnet_label','ViT_conf', 'ViT_label'] )
    for image in images:
        print(image.filename)
        yolo_res = YoloPredict(yolo,image,0.25)
        if not np.asarray(yolo_res).shape == (1,0):
            yolo_res = yolo_res[0].boxes.boxes
            resnet_res = Resnet_predict(resnet, image)
            vit_res = ViTPredict(image)

            new_row = {'Image':image.filename,'x1':yolo_res[0],'y1':yolo_res[1],
                       'x2':yolo_res[2],'y2':yolo_res[3],'Yolo_Conf':yolo_res[4], 'Resnet_conf':resnet_res[2],'Resnet_label':resnet_res[0],'ViT_conf': vit_res[1], 'ViT_label': vit_res[0]}
            df = df.append(new_row, ignore_index=True)
    df.to_csv('OUT.csv', sep='\t', encoding='utf-8')

def Resnet_predict(model, image):
    preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),x
    transforms.ToTensor(),
    transforms.Normalize(
    mean=[0.485, 0.456, 0.406],
    std=[0.229, 0.224, 0.225]
    )])
    img_preprocessed = preprocess(img)
    img_tensor = torch.unsqueeze(img_preprocessed, 0)
    out = model(img_tensor)
    with open('imagenet1000Classes.txt') as f:
    labels = [line.strip() for line in f.readlines()]
    _, index = torch.max(out, 1)
    percentage = torch.nn.functional.softmax(out, dim=1)[0] * 100
    return [index[0],percentage[index[0]].item()]


def YoloPredict(model, image, conf_low):
    return model.predict(source="/Users/shubanranganath/Desktop/HM/images/"+image.filename, save=False, show=False, save_txt=False, conf=conf_low)

def ViTPredict(img):
    model_name = 'B_16_imagenet1k'
    model = ViT(model_name, pretrained=True)
    model.eval()
    tfms = transforms.Compose([transforms.Resize(model.image_size), transforms.ToTensor(), transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),])
    image = tfms(Image.open("/Users/shubanranganath/Desktop/HM/images/"+img.filename)).unsqueeze(0)
    with torch.no_grad():
        outputs = model(image).squeeze(0)
    for idx in torch.topk(outputs, k=1).indices.tolist():
        prob = torch.softmax(outputs, -1)[idx].item()
        print('[{idx}] ({p:.2f}%)'.format(idx=idx ,p=prob*100))
    return [idx, prob]


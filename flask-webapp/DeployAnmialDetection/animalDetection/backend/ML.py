from ultralytics import YOLO
from transformers import ResNetModel
import numpy as np
from torchvision import transforms
import torch
from pytorch_pretrained_vit import ViT
import pandas as pd
import os
from PIL import Image
import torchvision

#Directories
WEIGHTS_PATH = os.path.join(os.getcwd(),"animalDetection/backend/weights/")

#model names

def initalize_yolov8():
    #YOLOv8 Declaration
    return YOLO(WEIGHTS_PATH + 'yolov8.pt')

def intialize_resnet():
    #Resnet model Declaration
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    resnet = torchvision.models.resnet50(weights=True)
    resnet = torch.nn.DataParallel(resnet)
    resnet = resnet.to(device)
    resnet.load_state_dict(torch.load(WEIGHTS_PATH + 'resnet.pth', 
                                    map_location=device))
    resnet.eval()
    return resnet

def initialize_vit():
    #ViT Model Declarations
    model_name = 'B_16_imagenet1k'
    vit = ViT(model_name, pretrained=True)
    vit.eval()
    return vit

def Resnet_predict(model, image, conf):
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )])
    img_preprocessed = preprocess(image)
    img_tensor = torch.unsqueeze(img_preprocessed, 0)
    out = model(img_tensor)

    with open(os.path.join(WEIGHTS_PATH,'resnetClasses.txt')) as f:
        labels = [line.strip() for line in f.readlines()]

    _, index = torch.max(out, 1)
    percentage = torch.nn.functional.softmax(out, dim=1)[0]

    if percentage[index[0]].item() < conf:
        return[0,0]
    return [index[0].item(),percentage[index[0]].item(),labels[index[0]]]



def YoloPredict(model, image, conf_low):
    result = model.predict(source=image, save=False, show=False,
                            save_txt=False, conf=conf_low)
    #print(len(result[0]))
    if len(result[0]) > 0:
        #print('YOLO detected')
        return (result[0].boxes.boxes.numpy()[0]).tolist()
    else:
        #print('YOLO not detected')
        return [0,0,0,0,0,0]
    

def ViTPredict(vit,image,conf_low):
    tfms = transforms.Compose([transforms.Resize(vit.image_size), 
                               transforms.ToTensor(), 
                               transforms.Normalize([0.5, 0.5, 0.5], 
                                                    [0.5, 0.5, 0.5]),])
    image = tfms(image).unsqueeze(0)

    with torch.no_grad():
        outputs = vit(image).squeeze(0)
    
    for idx in torch.topk(outputs, k=1).indices.tolist():
        prob = torch.softmax(outputs, -1)[idx].item()
        #print('[{idx}] ({p:.2f}%)'.format(idx=idx ,p=prob*100))
    
    if prob < conf_low:
        return [0,0]
    return [idx, prob]


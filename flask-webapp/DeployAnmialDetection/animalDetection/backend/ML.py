from ultralytics import YOLO
from transformers import ResNetModel
import numpy as np
from torchvision import transforms
import torch
from pytorch_pretrained_vit import ViT
import pandas as pd
from PIL import Image
import torchvision


# def predict(images):
#     for image in images:
#         print(image.filename)

def predict(images):
    WEIGHTS_PATH = 'weights/yolov8.pt'
    yolo8 = YOLO(WEIGHTS_PATH)

    resnet = torchvision.models.resnet50(weights=True)
    resnet = torch.nn.DataParallel(resnet)
    resnet = resnet.to(torch.device('cpu'))
    resnet.load_state_dict(torch.load('weights/resnet.pth',map_location=torch.device('cpu')))
    resnet.eval()
    
    my_dict= {}
    if len(images) > 0:
        for image in images:
            #save as PiL
            image = Image.open('images/'+image.filename)
            print('--------',image.filename,'--------')
            yolo_results = YoloPredict(yolo8, image, 0.25)
            arr=[image.filename,0,0,0,0,0,0,0,0,0]
            #check if animal is detected
            if yolo_results[4] != 0:
                print("animal detected: ", yolo_results[4]*100)
                vit_res = ViTPredict(image,0.25)
                resnet_res = Resnet_predict(resnet,image,0.25)
                #resnet_res = [0,0]
                #load results
                arr = [image.filename, yolo_results[0], yolo_results[1], 
                                yolo_results[2], yolo_results[3], yolo_results[4], resnet_res[0].item(), resnet_res[1], vit_res[1],vit_res[0]]
            
            print(arr,'\n')
            my_dict[image.filename] =  arr
            
            #close the file
            image.close()
        print(my_dict)
    return my_dict


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
    with open('imagenet1000Classes.txt') as f:
        labels = [line.strip() for line in f.readlines()]
    _, index = torch.max(out, 1)
    percentage = torch.nn.functional.softmax(out, dim=1)[0]
    if percentage[index[0]].item() < conf:
        return[0,0]
    return [index[0],percentage[index[0]].item()]


def YoloPredict(model, image, conf_low):
    result = model.predict(source=image, save=False, show=False,
                            save_txt=False, conf=conf_low)
    print(len(result[0]))
    if len(result[0]) > 0:
        print('detected')
        return result[0].boxes.boxes.numpy()[0]
    else:
        print('not detected')
        return [0,0,0,0,0,0]
    

def ViTPredict(image,conf_low):
    model_name = 'B_16_imagenet1k'
    model = ViT(model_name, pretrained=True)
    model.eval()
    tfms = transforms.Compose([transforms.Resize(model.image_size), transforms.ToTensor(), transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),])
    image = tfms(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(image).squeeze(0)
    for idx in torch.topk(outputs, k=1).indices.tolist():
        prob = torch.softmax(outputs, -1)[idx].item()
        print('[{idx}] ({p:.2f}%)'.format(idx=idx ,p=prob*100))
    if prob < conf_low:
        return [0,0]    
    return [idx, prob]
    

def ViTPreprocess(model,image):
    tfms = transforms.Compose([transforms.Resize(model.image_size), transforms.ToTensor(), transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),])
    img = tfms(image).unsqueeze(0)
    return img

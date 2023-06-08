# -*- coding: utf-8 -*-
"""Cal Data

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1d20rNorD14FW_mGBsT1M-iRbHJj20gwL

Importing required libries
"""

import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import PIL
import pathlib
import shutil
import glob
import string

"""Creating Dataframe from labeled csv for data analysis"""

csv_dir="/content/drive/Shareddrives/193/Code/CSV/Caltech_Camera_labels.csv"
#csv_dir="/content/drive/Shareddrives/193/Code/Brinda/CalCal_filtered_dataset_dataset.csv"
df = pd.read_csv(csv_dir)
image_id = df.image_id
label=df.original_label
#df=df.drop(columns=['Unnamed: 0'])
df.drop(columns=['loaction_id','sequence_id','scientific_name','common_name','datetime','annotation_I','kingdom','phylum','subphylum','superclass','class','subclass','infraclass','superorder','order','suborder','url','dataset_name','variety','subspecies','species','genus','tribe','subfamily','family','superfamily','infraorder'],inplace=True)
df.drop_duplicates(subset=['image_id'])
df

data=df[['image_id','original_label']]
data = data.dropna(subset=['image_id'])
#data = data.reset_index()
print(data.head())

"""Unique Labels

Dropping data with label car and empty as it should be filtered out by Object Detection
"""

df.drop(df[df['original_label'] == 'empty'].index, inplace = True)
df.drop(df[df['original_label'] == 'car'].index, inplace = True)

print(df.original_label.unique())

# storing path
path = '/content/drive/Shareddrives/193/Camera Data/Caltech_Camera_Traps/eccv_18_all_images_sm/'
data_dir = pathlib.Path("/content/drive/Shareddrives/193/Camera Data/Caltech_Camera_Traps")
# Check whether a path pointing to a file
isFile=os.path.isfile(path+'59942110-23d2-11e8-a6a3-ec086b02610b.jpg')
print(isFile)

img = list(data_dir.glob('eccv_18_all_images_sm/*'))  # list of image from folder

print("number of entries in df =",len(image_id),"\nnumber of images in folder =",len(img)) # list image names from df

"""Remove rows in df that dont have matching names with images in folder"""

names=[]
for img_name in data_dir.glob('eccv_18_all_images_sm/*'):
  head, tail = os.path.split(img_name)
  tail="Caltech Camera Traps : "+ tail
  names.append(tail)

df.image_id[1]

for i in range(len(df.image_id)):
  df.image_id[i]=df.image_id[i].replace('Caltech Camera Traps : ', '')
  df.image_id[i]=df.image_id[i]+'.jpg'

df

df.to_csv(r'/content/drive/Shareddrives/193/Code/Brinda/CalCal_filtered_dataset_dataset.csv')

data=df
data

data_dir = pathlib.Path("/content/drive/Shareddrives/193/Camera Data/Caltech_Camera_Traps")
names=[]
for img_name in data_dir.glob('eccv_18_all_images_sm/*'):
  head, tail = os.path.split(img_name)
  names.append(tail)
df=df[df['image_id'].isin(names)]
df = df.reset_index(drop=True)
len(df)# still some extra values 62643

df

len(data)

len(names)

len(df)

#flag=0
#for img_name in names:
  #for i in range(len(image_id)):
#if img_name==df.image_id[3]:
  #print("found",img_name)
  #flag=1
      #break
  #if flag == 0:  
    #df.drop(df[df['image_id'] == img_name], inplace = True)
  #else:
    #flag = 0

#storing df to json 
#df.to_json(r'/content/drive/Shareddrives/193/Code/Brinda/Cal_filtered_dataset.json')
#df.to_csv(r'/content/drive/Shareddrives/193/Code/Brinda/CalCal_filtered_dataset_dataset.csv')

#calling an opening a image
IMG_NO=3
print(img[IMG_NO])
PIL.Image.open(str(img[IMG_NO]))

#import json
#original_map = data.original_label.unique()
#with open("output.json", "w") as json:
#  json.write("{")
#  for count,line in enumerate(original_map):
#    if line=='empty':
#      continue
#    json.write("'"+str(count-1)+"':'")
#    json.write("".join(line) + "',") 
#with open("output.json", 'rb+') as filehandle:
#    filehandle.seek(-1, os.SEEK_END)
#    filehandle.truncate()
#json = open('output.json', 'a') # Open a file in append mode
#json.write('}') # Write some text
#json.close() # Close the file
#print(original_map)

#import json
#original_map = data.original_label.unique()
#with open("output.json", "w") as json:
#  json.write("{")
#  for count,line in enumerate(original_map):
#   if line=='empty':
#      continue
#    json.write("'"+str(count-1)+"':'")
#    json.write("".join(line) + "',") 
#with open("output.json", 'rb+') as filehandle:
#    filehandle.seek(-1, os.SEEK_END)
#   filehandle.truncate()
#json = open('output.json', 'a') # Open a file in append mode
#json.write('}') # Write some text
#json.close() # Close the file
#print(original_map)
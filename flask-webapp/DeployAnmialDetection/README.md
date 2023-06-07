# Basic Usage

Execute the 'runscript.sh' will start both backend and frontend server in the background.
It also shows detailed instructions in the terminal.

## First Step: Select Images

Press the first play button to select all the desired images.
If you want to select another set of image, you can press the same button again. This will clear all the previous images you selected.

## Second Step: Update Images and Output Yolov8 result

Press the Second Play button to update the images item in Django and in the /media directory.
Every time this button is pressed, all the old media data will get removed and replaced with new images selected at '''First Step'''.
After all images are uploaded, the program starts to run all images in the /media directory with the yolov8 model and will output a result file in the /media directory with the prediction results.

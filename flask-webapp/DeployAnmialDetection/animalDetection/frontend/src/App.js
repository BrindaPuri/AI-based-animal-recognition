import './App.css';
// import button_logo from "./assets/logo/play.png"
import image_logo from "./assets/logo/image.png"
import out_logo from "./assets/logo/out.png"
import scan_logo from "./assets/logo/scan.png"
import download_logo from "./assets/logo/download.png"
import React, {Component} from 'react';
import axios from 'axios';
import ProgressBar from "@ramonak/react-progress-bar";
import ImageUploading from "react-images-uploading";

axios.defaults.baseURL = "http://localhost:5000/"

function Logos({image, imageName, buttonFunction, disableFactor, disableErrorFunction}) {
  if(disableFactor) {
    return (
      <>
      <div className='big_circle'>
        <div className='small_circle'>
          {console.log({disableFactor})}
          <img src={image} alt="logo-logo" className={imageName} onClick={disableErrorFunction}>
          </img>
        </div>
      </div>
    </>
    );
  }
  return (
    <>
      <div className='big_circle'>
        <div className='small_circle'>
          {console.log({disableFactor})}
          <img src={image} alt="logo-logo" className={imageName} onClick={buttonFunction}>
          </img>
        </div>
      </div>
    </>
  );
}

function InfoText() {
  return (
    <>
      <div className="introtext" id="introtext" onClick={buttonInfo}>
        Animal Recognition AI Pipeline      
      </div>

      <div className="subtext" id="subtext">
        Identify animal species by uploading your own dataset.      
      </div>
    </>
    );
}
async function getAxios(url) {
  return await axios.get(url).then((r)=>console.log(r))
}

async function postAxios(url, data){
  return await axios.post(url, data,).then((r)=>console.log(r))
}

async function allPromiseGet(url) {
  const data = await Promise.allSettled([getAxios(url)])
  return data
}

async function allPromisePost(url, data) {
  const data = await Promise.allSettled([postAxios(url)])
  return data
}

function countProgress(proms) {
  let d = 0;
  setCurProgress(0);
  for (const p of proms) {
    p.then(()=> {    
      d ++;
      setCurProgress(d);
    });
  }
  return proms;
}

export default function App(){
// function notusing (){
  console.log("Get in App");

  const [images, setImages] = React.useState([]);
  const [uploadImageRender, setUploadImageRender] = React.useState(false);
  const [classificationRender, setClassificationRender] = React.useState(false);
  const [backToStartMessage, setBackToStartMessage] = React.useState(true);
  const [progressBarRender, setProgressBarRender] = React.useState(false);
  const [maxProgress, setMaxProgress] = React.useState(0)
  const [curProgress, setCurProgress] = React.useState(0)
  const [imageSize, setImageSize] = React.useState(0)
  const [finishDetect, setFinishDetect] = React.useState(true)
  const [finishClassification, setFinishClassification] = React.useState(true)
  const [printError, setPrintError] = React.useState(false)

  const onChange = (imageList, addUpdateIndex) => {
    //data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  
  const progressBarFunction = () => {
    console.log(curProgress)
    console.log(maxProgress)
    var percentage = Math.floor((curProgress/maxProgress)*100)
    return <ProgressBar completed={percentage} maxCompleted={100} barContainerClassName="barContainer"/>;
  }

  const uploadImage = async () => {
    let imagearr = [ ...images.values()];
    let all = imagearr.length;
    setMaxProgress(all)
    let promises = []
    imagearr.forEach(function (item, _) {
      let form_data = new FormData();
      console.log(item)
      let image = item['file']
      form_data.append('image', image)
      console.log(form_data);
      let url = '/uploadImages';
      promises.push(postAxios(url,form_data))
    });
    const data = await Promise.allSettled(countProgress(promises));
    // const data = Promise.all(promises)
    console.log(data)
  }

  const removeAllImage = async () => {
    let url = '/clearImages';
    allPromiseGet(url)
    .then((r)=>{console.log(r)})
    .then(()=>{console.log("finished clearing images")})
  }

  const detectAnimals = async () => {
    let url = '/yolov8Predict';
    console.log("starting to cleanup old media")
    console.log("starting to upload images")
    removeAllImage()
    .then(()=>{uploadImage()})
    .then(()=>{allPromiseGet(url)})
    .then((r)=>{console.log(r)})
    .then(()=>{setFinishDetect(false)})
    .then(()=>{console.log("finished detecting")})
  }

  const resnet = async () => {
    let url = '/resnetPredict';
    console.log("starting resnet")
    allPromiseGet(url)
    .then((r)=>{console.log(r)})
    .then(()=>{setFinishClassification(false)})
    .then(()=>{console.log("finished resnet detecting")})
  }

  const vit = async () => {
    let url = '/vitPredict';
    console.log("starting vit")
    allPromiseGet(url)
    .then((r)=>{console.log(r)})
    .then(()=>{console.log("finished vit detecting")})
    .then(()=>{setFinishClassification(false)})
  }

  const download = async () => {
    let url = '/download';
    console.log("starting downloading result")
    allPromiseGet(url)
    .then((r)=>{console.log(r)})
    .then(console.log("finished downloading"))
  }

  const checkImageEmpty = () => {
    return (images.length===0)
  }

  const topScreenRender = () => {
    if(uploadImageRender) {
      return (
      <div className='uploadimagefunction'>
      <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={3000}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpdate,
        onImageRemove
      }) => (
        <div className='uploadimage'>
          {setImageSize(images.length)}
          {setFinishClassification(true)}
          <div className='ImageSizeDisplay'>{imageSize} images have been selected.</div>

          {/* <div>
            {(() => {
              if (images.length === 0) {
                return (
                  alert("Please make sure to upload images.")
                )
              } 
            })()}
          </div> */}
          <div className='allImages'>
        {imageList.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image.data_url} alt="" width="100" />
            <div className="image-item__btn-wrapper">
              <button onClick={() => onImageUpdate(index)}>Update</button>
              <button onClick={() => onImageRemove(index)}>Remove</button>
            </div>
          </div>
        ))}
        </div>
        </div>
    )}
    </ImageUploading>
    </div>
    );
    }
    if(backToStartMessage) {
      return (<InfoText/>);
    }
    if(progressBarRender) {
      console.log("got in progress bar")
      return progressBarFunction()
    }
    if(classificationRender) {
      console.log("pick classification")
      return (
        <div className='pickClassification'>
          <button className='buttonClassify' onClick={()=>vit()}>ViT</button>
          <button className='buttonClassify' onClick={async ()=>resnet()}>Resnet</button>
        </div>
      );
    }
    if(printError) {
      let task = ""
      // if(finishClassification) {
      //   task = "upload images"
      // }
      if (finishDetect) {
        task = "upload images"
      } 
      if (checkImageEmpty()) {
        task = "select images"
      }

      
      console.log("not finished", {task})
      return (
        <div className='detectIncomplete'>
          You have not completed the {task} step. Please make sure to complete that first.
        </div>
      )
    }
  }

  return (
    <>
      <div className="topcontainer" id="topscreen">
        {topScreenRender()}
      </div>
      <div className='container' id="bottomscreen">
        {/*  */}
        <div className='Step1'>
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={3000}
            dataURLKey="data_url"
          >
            {({
              onImageUpload,
              onImageRemoveAll,
            }) => (
              <Logos image={image_logo} imageName="image" buttonFunction={()=>{onImageRemoveAll();onImageUpload();setUploadImageRender(true);setBackToStartMessage(false);}}/>
          )}
          </ImageUploading>
          <p className='insttext' id='insttext'>Select Image(s)</p>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step2'>
          <Logos image={out_logo} imageName="out" buttonFunction={()=>{setCurProgress(0);setProgressBarRender(true);setUploadImageRender(false);setBackToStartMessage(false);detectAnimals();}} disableFactor={checkImageEmpty()} disableErrorFunction={()=>{setUploadImageRender(false);setBackToStartMessage(false);setPrintError(true)}}/>
          <p className='insttext' id='insttext'>Upload & Detect</p>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step3'>
        
          <Logos image={scan_logo} imageName="scan" buttonFunction={()=>{setCurProgress(0);setProgressBarRender(false);setClassificationRender(true);setBackToStartMessage(false);setFinishDetect(true);}} disableFactor={finishDetect} disableErrorFunction={()=>{setUploadImageRender(false);setBackToStartMessage(false);setPrintError(true)}}/>
          {/* <PlayButton/> */}
          <p className='insttext' id='insttext'>Classify Animals</p>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step4'>
        
          <Logos image={download_logo} imageName="download" buttonFunction={()=>{download();setBackToStartMessage(false);}} disableFactor={finishClassification}/>
          {/* <PlayButton/> */}
          <p className='insttext' id='insttext'>Download Results</p>
        </div>
      </div>
    </>
  );
}

import './App.css';
// import button_logo from "./assets/logo/play.png"
import image_logo from "./assets/logo/image.png"
import out_logo from "./assets/logo/out.png"
import scan_logo from "./assets/logo/scan.png"
import download_logo from "./assets/logo/download.png"
import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import ProgressBar from "@ramonak/react-progress-bar";
import ImageUploading from "react-images-uploading";
import Plot from 'react-plotly.js';

axios.defaults.baseURL = "http://localhost:5000/"

function Logos({image, imageName, buttonFunction, disableFactor, disableErrorFunction}) {
  if(disableFactor) {
    return (
      <>
      <div className='big_circle' style={{background: "#000000"}}>
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
      <div className='big_circle' style={{background: "#0047BA"}}>
        <div className='small_circle'>
          {console.log({disableFactor})}
          <img src={image} alt="logo-logo" className={imageName} onClick={buttonFunction}>
          </img>
        </div>
      </div>
    </>
  );
}

function InfoText({buttonInfo}) {
  return (
    <>
      <div className="introtext" id="introtext" onClick={buttonInfo}>
        Animal Recognition AI Pipeline      
      </div>

      <div className="subtext" id="subtext">
        Identify animal species by uploading your own dataset.      
      </div>

      <div className="hidden" id="info">
        <p>created by Shuban Ranganath, Zhantong Qiu, Brinda Puri, and Sanskriti Jain</p>
        <p>ECS 193, Winter and Spring 2023</p>
      </div>
    </>
    );
}

async function getAxios(url) {
  return await axios.get(url,{
    headers: {
        'Content-Type': 'application/json'
    }}).then((r)=>console.log(r))
}

async function postAxios(url, data){
  return await axios.post(url, data,).then((r)=>console.log(r))
}

async function allPromiseGet(url) {
  const data = await Promise.allSettled([getAxios(url)])
  return data
}

async function allPromisePost(url, data) {
  const promise_data = await Promise.allSettled([postAxios(url, data)])
  return promise_data
}



export default function App(){

  const [images, setImages] = React.useState([]);
  const [progressInfoMessage, setProgressInfoMessage] = React.useState("")
  const [progressInfoColor, setProgressInfoColor] = React.useState("#000000")
  const [plotData, setPlotData] = useState(0);
  const [plotLayout, setPlotLayout] = useState(0);
  const [plot, setPlot] = useState("");
  const [plotUrl, setPlotUrl] = useState("/graphPie")
  
  //counters
  const [maxProgress, setMaxProgress] = React.useState(0)
  const [curProgress, setCurProgress] = React.useState(0)
  const [imageSize, setImageSize] = React.useState(0)


  //button function trigger
  const [finishSelectImages, setFinishSelectImages] = React.useState(false)
  const [finishDetect, setFinishDetect] = React.useState(false)
  const [finishClassification, setFinishClassification] = React.useState(false)
  const [onProgress, setOnProgress] = React.useState(false)
  

  //render triggers
  const [uploadImageRender, setUploadImageRender] = React.useState(false);
  const [startMessageRender, setStartMessageRender] = React.useState(true);
  const [progressBarRender, setProgressBarRender] = React.useState(false);
  const [classificationRender, setClassificationRender] = React.useState(false);
  const [printErrorRender, setPrintErrorRender] = React.useState(false)
  const [progressInfoRender, setProgressInfoRender] = React.useState(false)
  const [downloadPageRender, setDownloadPageRender] = React.useState(false)
  const [graphPageRender, setGraphPageRender] = React.useState(false)
  const onChange = (imageList, addUpdateIndex) => {
    //data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

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

  const removeAllButtonFlags = () => {
    setFinishSelectImages(false)
    setFinishDetect(false)
    setFinishClassification(false)
  }

  const renderImageUpload = () => {
    setUploadImageRender(true);
    setStartMessageRender(false);
    setProgressBarRender(false);
    setClassificationRender(false);
    setPrintErrorRender(false);
    setProgressInfoRender(false);
    setDownloadPageRender(false);
    setGraphPageRender(false);
  }

  const renderStartMessage = () => {
    setUploadImageRender(false);
    setStartMessageRender(true);
    setProgressBarRender(false);
    setClassificationRender(false);
    setPrintErrorRender(false);
    setProgressInfoRender(false);
    setDownloadPageRender(false);
    setGraphPageRender(false);
  }

  const renderProgressBar = () => {
    setUploadImageRender(false);
    setStartMessageRender(false);
    setProgressBarRender(true);
    setClassificationRender(false);
    setPrintErrorRender(false);
    setProgressInfoRender(false);
    setDownloadPageRender(false);
    setGraphPageRender(false);
  }

  const renderClassification = () => {
    setUploadImageRender(false);
    setStartMessageRender(false);
    setProgressBarRender(false);
    setClassificationRender(true);
    setPrintErrorRender(false);
    setProgressInfoRender(false);
    setDownloadPageRender(false);
    setGraphPageRender(false);
  }

  const renderPrintError = () => {
    setUploadImageRender(false);
    setStartMessageRender(false);
    setProgressBarRender(false);
    setClassificationRender(false);
    setPrintErrorRender(true);
    setProgressInfoRender(false);
    setDownloadPageRender(false);
    setGraphPageRender(false);
  }

  const renderProgressInfo = (message) => {
    setUploadImageRender(false);
    setStartMessageRender(false);
    setProgressBarRender(false);
    setClassificationRender(false);
    setPrintErrorRender(false);
    setProgressInfoRender(true);
    setProgressInfoMessage(message);
    setDownloadPageRender(false);
    setGraphPageRender(false);
  }

  const renderDownloadPage = () => {
    setUploadImageRender(false);
    setStartMessageRender(false);
    setProgressBarRender(false);
    setClassificationRender(false);
    setPrintErrorRender(false);
    setProgressInfoRender(false);
    setDownloadPageRender(true);
    setGraphPageRender(false);
  }

  const renderGraphPageRender = () => {
    setUploadImageRender(false);
    setStartMessageRender(false);
    setProgressBarRender(false);
    setClassificationRender(false);
    setPrintErrorRender(false);
    setProgressInfoRender(false);
    setDownloadPageRender(false);
    setGraphPageRender(true);
  }

  const renderPercentage = (message) =>{
    console.log(curProgress)
    console.log(maxProgress)
    var percentage = Math.floor((curProgress/maxProgress)*100)
    return (
      <>
      <p className='percent' id='percent'>{message}</p>
      <p className='percent' id='percent'>{percentage}%</p>
      </>
    );
  }

  const progressInfo = (message) => {

    return (
      <>
      <p className='percent' id='percent' style={{color:progressInfoColor}}>{message}</p>
      </>
    );
  }

  const lineColor = (factor) => {
    if (factor) {
      return "#0047BA";
    } else {
      return "#000000";
    }
  }

  const getGraph = async (url) => {
    setOnProgress(true)
    renderProgressInfo("Generating Graphs")
    await Promise.allSettled[axios.get(url ,{
        headers: {
            'Content-Type': 'application/json',
        }
    },)
    .then(res => {setPlotData(JSON.parse(JSON.stringify(res)).data.data);
      setPlotLayout(JSON.parse(JSON.stringify(res)).data.layout)})
      .then(()=>{renderGraphPageRender();setOnProgress(false)})]

  };

  const showHide = () => {
    var div = document.getElementById("info");
    div.classList.toggle('hidden'); 
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
    setOnProgress(true)
    await removeAllImage()
    .then(()=>{renderProgressBar()})
    .then(async ()=>{await uploadImage()})
    .then(()=>{setProgressInfoColor("#000000")})
    .then(()=>{renderProgressInfo("Running Yolov8 Model")})
    .then(async ()=>{await allPromiseGet(url)})
    .then((r)=>{console.log(r)})
    .then(()=>{setFinishDetect(true)})
    .then(()=>{console.log("finished detecting")})
    .then(()=>{setOnProgress(false)})
    .then(()=>{setProgressInfoColor("#0047BA")})
    .then(()=>{renderProgressInfo("Finished Yolov8 Detection")})
  }

  const resnet = async () => {
    let url = '/resnetPredict';
    console.log("starting resnet")
    setOnProgress(true)
    setProgressInfoColor("#000000")
    renderProgressInfo("Running ResNet")
    allPromiseGet(url)
    .then((r)=>{console.log(r)})
    .then(()=>{setFinishClassification(true)})
    .then(()=>{console.log("finished resnet detecting")})
    .then(()=>{setProgressInfoColor("#0047BA")})
    .then(()=>{renderProgressInfo("Finished ResNet Classification")})
    .then(()=>{setOnProgress(false)})
    .then(()=>{setProgressInfoColor("#000000")})
    .then(()=>{renderClassification()})
  }

  const vit = async () => {
    let url = '/vitPredict';
    console.log("starting vit")
    setOnProgress(true)
    setProgressInfoColor("#000000")
    renderProgressInfo("Running Vit")
    await allPromiseGet(url)
    .then((r)=>{console.log(r)})
    .then(()=>{console.log("finished vit detecting")})
    .then(()=>{setFinishClassification(true)})
    .then(()=>{setProgressInfoColor("#0047BA")})
    .then(()=>{renderProgressInfo("Finished Vit Classification")})
    .then(()=>{setOnProgress(false)})
    .then(()=>{setProgressInfoColor("#000000")})
    .then(()=>{renderClassification()})
  }

  const download = async () => {
    let url = '/download';
    console.log("starting downloading result")
    setOnProgress(true)
    setProgressInfoColor("#000000")
    renderProgressInfo("Downloading CSV file")
    await allPromiseGet(url)
    .then((r)=>{console.log(r)})
    .then(console.log("finished downloading"))
    .then(()=>{setOnProgress(false)})
    .then(()=>renderDownloadPage())
  }

  const sortimages = async () => {
    let url = '/sortImages';
    console.log("starting sorting images")
    setProgressInfoColor("#000000")
    renderProgressInfo("Sorting Images In Output Folder")
    setOnProgress(true)
    await allPromiseGet(url)
    .then((r)=>{console.log(r)})
    .then(console.log("sorting images"))
    .then(()=>{setOnProgress(false)})
    .then(()=>renderDownloadPage())
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
          {setOnProgress(false)}
          <div className='ImageSizeDisplay'>{imageSize} images have been selected.</div>
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
    if(startMessageRender) {
      return (<InfoText buttonInfo={()=>{showHide()}}/>);
    }
    if(progressBarRender) {
      console.log("got in progress bar")
      // return progressBarFunction()
      return renderPercentage("Image Uploading")
    }
    if(graphPageRender) {
      return (
        <div className='graphContent'>
          <button className='graphButton' onClick={()=>{getGraph("/graphPie")}}>Detection Pie Graph</button>
          <button className='graphButton'onClick={()=>{getGraph("/graphTime")}}>Time VS Detection</button>
        <Plot data={plotData} layout={plotLayout}/>
        </div>
      );
    }
    if(classificationRender) {
      console.log("pick classification")
      return (
        <div className='pickClassification'>
          <button className='buttonClassify' onClick={()=>vit()} disabled={onProgress}>ViT</button>
          <button className='buttonClassify' onClick={async ()=>resnet()} disabled={onProgress}>Resnet</button>
        </div>
      );
    }

    if(downloadPageRender) {
      console.log("get to download page")
      return (
        <>
        <div className='downloadpageclass'>
          <button className='buttonDownload' onClick={()=>{download()}} disabled={onProgress}>Download CSV</button>
          <button className='buttonDownload' onClick={()=>{sortimages()}} disabled={onProgress}>Sort Image To Folders</button>
          <button className='buttonDownload' onClick={()=>{getGraph("/graphPie")}} disabled={onProgress}>Show Graphs</button>
        </div>
        </>
      )
    }
    if (progressInfoRender) {
      return progressInfo(progressInfoMessage)
    }
    if(printErrorRender) {
      let task = "classification"
      if (!finishDetect) {
        task = "upload images"
      } 
      if (checkImageEmpty()) {
        task = "select images"
      }
      console.log("not finished", {task})
      return (
        <div className='detectIncomplete' onClick={()=>{renderStartMessage()}}>
          You have not completed the {task} step. Please make sure to complete that first.
        </div>
      )
    }
  }

  const nothing = () => {
    console.log("got in nothing")
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
              <Logos image={image_logo} imageName="image" buttonFunction={()=>{setOnProgress(true);removeAllButtonFlags();onImageRemoveAll();onImageUpload();renderImageUpload()}} disableFactor={onProgress} disableErrorFunction={()=>{nothing()}}/>
          )}
          </ImageUploading>
          <p className='insttext' id='insttext'>Select Image(s)</p>
        </div>
        <div className='line' style={{background : lineColor(!checkImageEmpty())}}></div>
        {/*  */}
        <div className='Step2'>
          <Logos image={out_logo} imageName="out" buttonFunction={()=>{setCurProgress(0);renderProgressBar();detectAnimals()}} disableFactor={checkImageEmpty()|onProgress} disableErrorFunction={()=>{!onProgress ? renderPrintError(): nothing()}}/>
          <p className='insttext' id='insttext'>Upload & Detect</p>
        </div>
        <div className='line' style={{background : lineColor(finishDetect)}}></div>
        {/*  */}
        <div className='Step3'>
          <Logos image={scan_logo} imageName="scan" buttonFunction={()=>{renderClassification()}} disableFactor={(!finishDetect)|onProgress} disableErrorFunction={()=>{!onProgress? renderPrintError(): nothing()}}/>
          {/* <PlayButton/> */}
          <p className='insttext' id='insttext'>Classify Animals</p>
        </div>
        <div className='line' style={{background : lineColor(finishClassification)}}></div>
        {/*  */}
        <div className='Step4'>
          <Logos image={download_logo} imageName="download" buttonFunction={()=>{renderDownloadPage();}} disableFactor={(!finishClassification)|onProgress} disableErrorFunction={()=>{!onProgress? renderPrintError(): nothing()}}/>
          {/* <PlayButton/> */}
          <p className='insttext' id='insttext'>Download Results</p>
        </div>
      </div>
    </>
  );
}

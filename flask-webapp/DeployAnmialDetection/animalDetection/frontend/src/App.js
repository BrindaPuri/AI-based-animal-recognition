import './App.css';
// import button_logo from "./assets/logo/play.png"
import image_logo from "./assets/logo/image.png"
import out_logo from "./assets/logo/out.png"
import scan_logo from "./assets/logo/scan.png"
import download_logo from "./assets/logo/download.png"
import document_logo from "./assets/logo/document_logo.jpg"
import React, {useState} from 'react';
import axios from 'axios';
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
  const [ifHasMetadata, setIfHasMetadata] = useState(false)
  const [ifHasResnetData, setIfHasResnetData] = useState(false)
  const [resnetWeightfile, setResnetWeightFile] = useState()
  const [resnetWeightInUse, setResnetWeightInUse] = useState("resnet.pth")
  const [yolov8ConValue, setYolov8ConValue] = useState(0.25)
  const [resnetConValue, setResnetConValue] = useState(0.25)
  const [vitConValue, setVitConValue] = useState(0.25)

  //counters
  const [maxProgress, setMaxProgress] = React.useState(0)
  const [curProgress, setCurProgress] = React.useState(0)
  const [imageSize, setImageSize] = React.useState(0)


  //button function trigger
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
  const [settingButtonRender, setSettingButtonRender] = React.useState(true)
  const [settingPageRender, setSettingPageRender] = React.useState(false)
  const [settingResnetWeightError, setSettingResnetWeightError] = React.useState("#3DAE2B")


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
    setFinishDetect(false)
    setFinishClassification(false)
  }

  // const ifAllButtonFlagFalse = () => {
  //   return !(finishDetect|finishClassification)
  // }

  const renderSettingButton = () => {
    if (settingButtonRender) {
      if(onProgress) {
        return (
          <>
          <div className='setting'>
            <div className='setting_outline' style={{background : "black"}}>
              <div className='setting_inline'>
                <img className='settingbutton' alt="logo-logo" src={document_logo}></img>
              </div>
            </div>
            <p className='setting_text' id='setting_text'>Setting</p>
          </div>
          </>
        );
      }
      return (
        <>
        <div className='setting'>
          <div className='setting_outline'>
            <div className='setting_inline'>
              <img className='settingbutton' alt="logo-logo" src={document_logo} onClick={()=>{renderSettingPageRender()}}></img>
            </div>
          </div>
          <p className='setting_text' id='setting_text'>Setting</p>
        </div>
        </>
      );
    }
    return (<></>)
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
    setSettingPageRender(false);
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
    setSettingPageRender(false);
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
    setSettingPageRender(false);
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
    setSettingPageRender(false);
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
    setSettingPageRender(false);
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
    setSettingPageRender(false);
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
    setSettingPageRender(false);
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
    setSettingPageRender(false);
  }

  const renderSettingPageRender = () => {
    setUploadImageRender(false);
    setStartMessageRender(false);
    setProgressBarRender(false);
    setClassificationRender(false);
    setPrintErrorRender(false);
    setProgressInfoRender(false);
    setDownloadPageRender(false);
    setGraphPageRender(false);
    setSettingPageRender(true);
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

  const checkIf = async (url, setupfunct) => {
    await Promise.allSettled([
      axios.get(url,{
        headers: {
            'Content-Type': 'application/json',
        }
    },).then((res)=>{setupfunct(JSON.parse(JSON.stringify(res)).data.result==="true")})]
    )
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

  const handleModelConfidentValue = (event, setupfunct) => {
    var value = Math.max(0.05, Math.min(0.99, Number(event.target.value)));
    value = Math.round(value*1000)/1000
    setupfunct(value)
  }

  const handleResnetWeightFileChange = (event) => {
    let input = event.target.files[0];
    if (!input) return;
    let data = new FormData();
    data.append("fileToUpload", input);
    console.log(input)
    setResnetWeightFile(data);
  };

  const handleResnetWeightFileUpload = async () => {
    console.log(resnetWeightfile)
    setSettingResnetWeightError("#3DAE2B")
    setOnProgress(true)
    if (resnetWeightfile) {
      await Promise.allSettled([
        axios.post("/ifResnetWeightWorks", resnetWeightfile,)
        .then(res=>{setResnetWeightInUse(JSON.parse(JSON.stringify(res)).data.result)})
        .then(()=>console.log(resnetWeightInUse))
        .then(()=>{resnetWeightInUse==="resnet.pth"?setSettingResnetWeightError("red"):setSettingResnetWeightError("#3DAE2B")})
      ])
    }
    setOnProgress(false)
  }

  const showHide = () => {
    var div = document.getElementById("info");
    div.classList.toggle('hidden'); 
  }

  const ifHideButton = (iffactor) => {
    console.log(iffactor)
    if(iffactor) {
      return {display : "none"}
    } else {
      return {}
    }
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
    .then(async ()=>{await allPromisePost(url, {conf : yolov8ConValue})})
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

    allPromisePost(url,{name : resnetWeightInUse, conf : resnetConValue})
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
    await allPromisePost(url, {conf : vitConValue})
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
      console.log(ifHasMetadata)
      return (
        <>
        <div className='graphContent'>
          <button className='graphButton' id='graphPie' onClick={()=>{getGraph("/graphPie")}}>Detection Pie Graph</button>
          {ifHasMetadata?<button className='graphButton' id='graphTime' onClick={()=>{getGraph("/graphTime")}}>Time VS Detection</button>:<></>}
          {ifHasResnetData?<button className='graphButton' id='graphResnetClass' onClick={()=>{getGraph("/graphResnetClass")}}>Resnet Classification Chart</button>:<></>}
        <Plot data={plotData} layout={plotLayout}/>
        </div>
        </>
      );
    
      
    }
    if(classificationRender) {
      console.log("pick classification")
      checkIf('/ifHasMetadata',setIfHasMetadata)
      return (
        <div className='pickClassification'>
          <button className='buttonClassify' onClick={()=>vit()} disabled={onProgress}>ViT</button>
          <button className='buttonClassify' onClick={async ()=>resnet()} disabled={onProgress}>Resnet</button>
        </div>
      );
    }

    if(settingPageRender) {
      return (
        <>
        <div className='settingInput'>
          {/* yolov8 */}
          <p className='conTitle' id='conTitle'>Yolov8 Confident Value (default: 0.25) :</p>
          <p className='conText' id='conText'>Currently Using: {yolov8ConValue} </p>
          <input type='number'  maxLength="4"  min="0.05" max="0.99" disabled={onProgress} onChange={(e)=>{handleModelConfidentValue(e,setYolov8ConValue)}}></input>
          {/* resnet */}
          <p className='conTitle' id='conTitle'>ResNet Confident Value (default: 0.25) :</p>
          <p className='conText' id='conText'>Currently Using: {resnetConValue} </p>
          <input type='number' maxLength="4" min="0.05" max="0.99" disabled={onProgress} onChange={(e)=>{handleModelConfidentValue(e,setResnetConValue)}}></input>
          {/* vit */}
          <p className='conTitle' id='conTitle'>VIT Confident Value (default: 0.25) :</p>
          <p className='conText' id='conText'>Currently Using: {vitConValue} </p>
          <input type='number' maxLength="4" min="0.05" max="0.99" disabled={onProgress} onChange={(e)=>{handleModelConfidentValue(e,setVitConValue)}}></input>
          {/* resnet weight file */}
        <p className='conTitle' id='conTitle'>ResNet Weight File :</p>
        <p className='conText' id='conText' style={{color: settingResnetWeightError}}>Currently Using: {resnetWeightInUse}</p>
          <input type="file" id="newFile" disabled={onProgress} accept=".pth" onChange={(e)=>handleResnetWeightFileChange(e)} />
          <button className='resnetweightbutton' disabled={onProgress} onClick={()=>handleResnetWeightFileUpload()}>Upload</button>
        </div>
        </>
      );
    }

    if(downloadPageRender) {
      checkIf('/ifHasResnetData', setIfHasResnetData)
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
        {renderSettingButton()}
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
              <Logos image={image_logo} imageName="image" buttonFunction={()=>{setSettingButtonRender(true);setOnProgress(true);removeAllButtonFlags();onImageRemoveAll();onImageUpload();renderImageUpload()}} disableFactor={onProgress} disableErrorFunction={()=>{nothing()}}/>
          )}
          </ImageUploading>
          <p className='insttext' id='insttext'>Select Image(s)</p>
        </div>
        <div className='line' style={{background : lineColor(!checkImageEmpty())}}></div>
        {/*  */}
        <div className='Step2'>
          <Logos image={out_logo} imageName="out" buttonFunction={()=>{setSettingButtonRender(false);setCurProgress(0);renderProgressBar();detectAnimals()}} disableFactor={checkImageEmpty()|onProgress} disableErrorFunction={()=>{!onProgress ? renderPrintError(): nothing()}}/>
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

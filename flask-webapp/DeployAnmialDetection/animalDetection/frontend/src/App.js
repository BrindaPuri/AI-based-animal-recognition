import './App.css';
// import button_logo from "./assets/logo/play.png"
import image_logo from "./assets/logo/image.png"
import out_logo from "./assets/logo/out.png"
import scan_logo from "./assets/logo/scan.png"
import download_logo from "./assets/logo/download.png"
import React, {Component} from 'react';
import axios from 'axios';
import ProgressBar from "@ramonak/react-progress-bar";

// import ReactDOM from "react-dom";
import ImageUploading from "react-images-uploading";

axios.defaults.baseURL = "http://localhost:5000/"


// function PlayButton({ buttonFunction }) {
//   return (
//     <>
//       <button className='button'>
//         <img src={button_logo} className="play" alt="button-logo" onClick={buttonFunction}/>
//       </button>
//     </>
//     );
// }

function Logos({image, imageName, buttonFunction}) {
  return (
    <>
      <div className='big_circle'>
        <div className='small_circle'>
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
        Welcome to the Animal Recognition AI Pipeline.      
      </div>
      <div className="hidden" id="info">
        <p>created by Shuban Ranganath, Zhantong Qiu, Brinda Puri, and Sanskriti Jain</p>
        <p>ECS 193, Winter and Spring 2023</p>
      </div>
    </>
    );
}
async function getAxios(url) {
  return await axios.get(url)
}

async function postAxios(url, data){
  return await axios.post(url, data,)
}

export default function App(){
// function notusing (){
  console.log("Get in App");

  const [images, setImages] = React.useState([]);
  const [uploadImageRender, setUploadImageRender] = React.useState(false);
  const [backToStartMessage, setBackToStartMessage] = React.useState(true);
  const [progressBarRender, setProgressBarRender] = React.useState(false);
  const [maxProgress, setMaxProgress] = React.useState(0)
  const [curProgress, setCurProgress] = React.useState(0)
  const [imageSize, setImageSize] = React.useState(0)

  const onChange = (imageList, addUpdateIndex) => {
    //data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };


  
  const progressBarFunction = () => {
    console.log(curProgress)
    console.log(maxProgress)
    var percentage = Math.floor((curProgress/maxProgress)*100)
    return <ProgressBar completed={percentage} maxCompleted={100} />;
  }

  function allProgress(proms) {
    let d = 0;
    setCurProgress(0);
    for (const p of proms) {
      p.then(()=> {    
        d ++;
        setCurProgress(d);
      });
    }
    return Promise.all(proms);
  }

  const uploadImage = async () => {
    let imagearr = [ ...images.values()];
    let all = imagearr.length;
    setMaxProgress(all)
    let promises = []
    imagearr.forEach(function (item, index) {
      let form_data = new FormData();
      console.log(item)
      let image = item['file']
      form_data.append('images', image)
      console.log(form_data);
      let url = '/uploadImages';
      promises.push(postAxios(url,form_data))
    });
    const data = allProgress(promises)
    console.log(data)
  }

  const removeAllImage = async () => {
    let url = 'http://localhost:8000/djimagelist/';
    const promises = [getAxios(url)];
    const data = await Promise.allSettled(promises);
    console.log(data)
  }

  const detectAnimals = async () => {
    let url = 'http://localhost:8000/prediction/detect/';
    console.log("starting to cleanup old media")
    removeAllImage();
    console.log("starting to upload images")
    uploadImage()
    console.log("finished upload image, start detecting")
    const promises = [getAxios(url)];
    const data = await Promise.allSettled(promises);
    console.log(data);
    console.log("finished detecting")
  }

  const showHide = () => {
    var div = document.getElementById("info");
    div.classList.toggle('hidden'); 
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
          <div className='ImageSizeDisplay'>{imageSize}</div>
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
    )}
    </ImageUploading>
    </div>
    );
    }
    if(backToStartMessage) {
      return (<InfoText buttonInfo={()=>{showHide();}}/>);
    }
    if(progressBarRender) {
      console.log("got in progress bar")
      return progressBarFunction()
    }
  }

  return (
    <>
      <div className="container" id="topscreen">
        {topScreenRender()}
      </div>
      <div className='container' id="bottomscreen">
        {/*  */}
        <div className='Step1'>
          Upload Image
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
          <Logos image={image_logo} imageName="image" buttonFunction={()=>{onImageUpload();onImageRemoveAll();setUploadImageRender(true);setBackToStartMessage(false);}}/>
          )}
          </ImageUploading>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step2'>
          Detect Animals
          <Logos image={out_logo} imageName="out" buttonFunction={()=>{setCurProgress(0);setProgressBarRender(true);setUploadImageRender(false);setBackToStartMessage(false);detectAnimals();}}/>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step3'>
          Classify Animals
          <Logos image={scan_logo} imageName="scan"/>
          {/* <PlayButton/> */}
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step4'>
          Download Results
          <Logos image={download_logo} imageName="download"/>
          {/* <PlayButton/> */}
        </div>
      </div>
    </>
  );
}
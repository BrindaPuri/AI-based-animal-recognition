import './App.css';
// import button_logo from "./assets/logo/play.png"
import image_logo from "./assets/logo/image.png"
import out_logo from "./assets/logo/out.png"
import scan_logo from "./assets/logo/scan.png"
import download_logo from "./assets/logo/download.png"
import React, {Component} from 'react';
import axios from 'axios';

// import ReactDOM from "react-dom";
import ImageUploading from "react-images-uploading";


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
  // const [detectiondata, setDetectiondata] = React.useState([])

  const onChange = (imageList, addUpdateIndex) => {
    //data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const printConsole = (message) => {
    console.log(message);
  }
  
  // const ProgressBar = (current, goal) => {
  

  const uploadImage = async () => {
    let counter = 0;
    let imagearr = [ ...images.values()];
    let all = imagearr.length;
    let promises = []
    imagearr.forEach(function (item, index) {
      let form_data = new FormData();
      console.log(item)
      let image = item['file']
      form_data.append('images', image, image.name)
      console.log(form_data);
      let url = 'http://localhost:8000/djimagelist/';
      promises.push(postAxios(url,form_data))
    });
    const data = await Promise.allSettled(promises);
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
    while(!uploadImage()){
      console.log("waiting for images to upload")
    }
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

  return (
    <>
      <div className="container" id="topscreen">
        <InfoText buttonInfo={()=>{showHide();}}/>
      </div>
      <div className='container' id="bottomscreen">
        {/*  */}
        <div className='Step1'>
          Upload Image
          {/* <Logos image={image_logo} imageName="image"/> */}
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            // maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove
            }) => (
            // <Logos 
            //   image={image_logo} 
            //   imageName="image" 
            //   buttonFunction={()=>{onImageRemoveAll();onImageUpload();}}
            //   {imageList.map((image, index) => (
            //     <div key={index} className="image-item">
            //       <img src={image.data_url} alt="" width="100" />
            //       <div className="image-item__btn-wrapper">
            //         <button onClick={() => onImageUpdate(index)}>Update</button>
            //         <button onClick={() => onImageRemove(index)}>Remove</button>
            //       </div>
            //     </div>
            //   ))}
            // />
            <div className='big_circle'>
              <div className='small_circle'>
                <img src={image_logo} alt="logo-logo" className={"image"} onClick={()=>{onImageRemoveAll();onImageUpload();}}>
                </img>
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
                    
          {/* <PlayButton buttonFunction={()=>{onImageRemoveAll();onImageUpload();}}/>)} */}
          </ImageUploading>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step2'>
          Detect Animals
          <Logos image={out_logo} imageName="out" buttonFunction={()=>{detectAnimals();}}/>
          {/* <PlayButton buttonFunction={()=>{detectAnimals();}}/> */}
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

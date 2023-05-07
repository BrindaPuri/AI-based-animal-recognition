import './App.css';
import button_logo from "./assets/logo/play.png"
import image_logo from "./assets/logo/image.png"
import out_logo from "./assets/logo/out.png"
import scan_logo from "./assets/logo/scan.png"
import download_logo from "./assets/logo/download.png"
import React, {Component} from 'react';
import axios from 'axios';

// import ReactDOM from "react-dom";
import ImageUploading from "react-images-uploading";


function PlayButton({ buttonFunction }) {
  return (
    <>
      <button className='button'>
        <img src={button_logo} className="play" alt="button-logo" onClick={buttonFunction}/>
      </button>
    </>
    );
}

function Logos({image, imageName}) {
  return (
    <>
      <div className='big_circle'>
        <div className='small_circle'>
          <img src={image} alt="logo-logo" className={imageName}>
          </img>
        </div>
      </div>
    </>
  );
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

  // }

  const uploadImage = () => {
    let counter = 0;
    let imagearr = [ ...images.values()];
    let all = imagearr.length;
    imagearr.forEach(function (item, index) {
      let form_data = new FormData();
      console.log(item)
      let image = item['file']
      form_data.append('images', image, image.name)
      console.log(form_data);
      let url = 'http://localhost:8000/djimagelist/';
      axios.post(url, form_data, )
          .then(res => {
            console.log(res.data);
          })
          .catch(err => console.log(err))

      counter = counter + 1;
    });
    if(counter >= all) {
      return true
    } else {
      return false
    }
  }

  const removeAllImage = () => {
    let url = 'http://localhost:8000/djimagelist/';
    axios.get(url).then(res => {
      console.log(res.data);
    })
    .catch(err => console.log(err))
  }

  const detectAnimals = () => {
    let url = 'http://localhost:8000/prediction/detect/';
    while(!uploadImage()){
      console.log("waiting for images to upload")
    }
    console.log("finished upload image, start detecting")
    axios.get(url)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err))
    
  }

  return (
    <>
      <div className='container' >
        {/*  */}
        <div className='Step1'>
          <Logos image={image_logo} imageName="image"/>
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
              onImageRemoveAll
            }) => (
          <PlayButton buttonFunction={()=>{onImageRemoveAll();onImageUpload();}}/>)}
          </ImageUploading>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step2'>
          <Logos image={out_logo} imageName="out"/>
          <PlayButton buttonFunction={()=>{removeAllImage();detectAnimals();}}/>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step3'>
          <Logos image={scan_logo} imageName="scan"/>
          <PlayButton/>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step4'>
          <Logos image={download_logo} imageName="download"/>
          <PlayButton/>
        </div>
      </div>
    </>
  );
}
